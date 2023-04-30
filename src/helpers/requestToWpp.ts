import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config({ path: './env/dev.env' });

export default async function requestToWpp(
  params: string,
  messageData: any,
  token: string,
) {
  try {
    const messageStatus = await axios.post(
      `${process.env.WPP_BOT_URL}/${params}`,
      messageData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log(messageStatus.data);
  } catch (error) {
    console.log(error);
  }
}
