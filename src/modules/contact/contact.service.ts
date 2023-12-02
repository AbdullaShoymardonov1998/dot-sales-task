import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import axios from 'axios';
import { AMO_CRM_URL } from 'src/const/endpoints';
import {
  CLIENT_ID,
  CLIENT_SECRET,
  LINK,
  REDIRECT_URI,
  REFRESH_TOKEN,
  TOKEN,
} from 'src/const/keys';

@Injectable()
export class ContactService {
  token = TOKEN;
  async getAllContacts(query: CreateContactDto) {
    const { data, status } = await axios({
      method: 'GET',
      url: `${AMO_CRM_URL}/contacts`,
      headers: {
        Authorization: this.token,
      },
      validateStatus: () => true,
      params: {
        query: query.email,
      },
    });

    if (status === 401) {
      const newToken = await this.getAccessToken();
      this.token = newToken;
      console.log(newToken);
    }

    if (data) {
      const contactId = data._embedded.contacts[0].id;
      await this.updateContact(contactId, query);

      return {
        message: 'Contact updated successfully',
      };
    } else {
      const contactId = await this.createContact(query);
      await this.createLead(contactId, query.name);

      return {
        message: 'Contact and Lead are created successfully',
      };
    }
  }

  private async createContact(body: CreateContactDto) {
    try {
      const { data } = await axios({
        method: 'POST',
        url: `${AMO_CRM_URL}/contacts`,
        headers: {
          Authorization: this.token,
        },
        validateStatus: () => true,
        data: [
          {
            first_name: body.name,
            custom_fields_values: [
              {
                field_id: 225331,
                values: [
                  {
                    value: body.phone,
                  },
                ],
              },
              {
                field_id: 225333,
                values: [
                  {
                    value: body.email,
                  },
                ],
              },
            ],
          },
        ],
      });
      const contactId = data._embedded.contacts[0].id;
      return contactId;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  private async updateContact(id: number, body: CreateContactDto) {
    try {
      await axios({
        method: 'PATCH',
        url: `${AMO_CRM_URL}/contacts/${id}`,
        headers: {
          Authorization: this.token,
        },
        validateStatus: () => true,
        data: {
          first_name: body.name,
          custom_fields_values: [
            {
              field_id: 225331,
              values: [
                {
                  value: body.phone,
                },
              ],
            },
            {
              field_id: 225333,
              values: [
                {
                  value: body.email,
                },
              ],
            },
          ],
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  private async createLead(contactId: number, contactName: string) {
    try {
      await axios({
        method: 'POST',
        url: `${AMO_CRM_URL}/leads`,
        headers: {
          Authorization: this.token,
        },
        validateStatus: () => true,
        data: [
          {
            name: `Сделка для ${contactName}`,
            contacts: [
              {
                id: contactId,
              },
            ],
          },
        ],
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  private async getAccessToken() {
    const config = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN,
      redirect_uri: REDIRECT_URI,
    };
    try {
      const { data, status } = await axios({
        method: 'POST',
        url: LINK,
        validateStatus: () => true,
        data: config,
      });

      console.log(data);
      console.log(status);
      const accessToken = data.access_token;

      return `Bearer ${accessToken}`;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
