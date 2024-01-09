import { Admin, Resource, DataProvider } from 'react-admin';
import axios from 'axios';
import CryptoJS from 'crypto-js';

import { UserList } from './UserList';
import { CharacterList } from './CharacterList';
import { useSession } from 'next-auth/react';

import { User } from '@/app/_types';
import { Character } from '@/app/_types';

const encryptToken = (token: string) => {
  const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY; // 環境変数から秘密鍵を取得
  return CryptoJS.AES.encrypt(token, secretKey!).toString();
};

const App = () => {
  const { data: session } = useSession();
  const token = process.env.NEXT_PUBLIC_ENCRYPTION_TOKEN;
  const encryptedToken = encryptToken(token!); 

  const dataProvider: DataProvider = {
    getList: async (resource, params) => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/${resource}`;
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${encryptedToken}`, // トークンを適切に設定
            'X-Requested-With': 'XMLHttpRequest'
          },
          withCredentials: true,
        });

        return {
          data: response.data,
          total: response.data.length,
        };
      } catch (error) {
        console.error(error);
        throw new Error('データの取得に失敗しました');
      }
    },

    getOne: async (resource, params) => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/${resource}/${params.id}`;
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${encryptedToken}`,
          'X-Requested-With': 'XMLHttpRequest'
        },
        withCredentials: true,
      });
      return {
        data: response.data
      };
    },
  
    update: async (resource, params) => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/${resource}/${params.id}`;
      const response = await axios.put(url, { [resource]: params.data }, {
        headers: {
          'Authorization': `Bearer ${encryptedToken}`,
          'X-Requested-With': 'XMLHttpRequest'
        },
        withCredentials: true,
      });
      return {
        data: response.data
      };
    },
  
    deleteMany: async (resource, params) => {
      await Promise.all(
        params.ids.map(id => axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/${resource}/${id}`, {
          headers: {
            'Authorization': `Bearer ${encryptedToken}`,
            'X-Requested-With': 'XMLHttpRequest'
          },
          withCredentials: true,
        }))
      );
    
      // 削除されたIDの配列を返す
      return { data: params.ids };
    },
    // 他のメソッドのダミー実装
    getMany: () => Promise.reject(),
    getManyReference: () => Promise.reject(),
    updateMany: () => Promise.reject(),
    create: () => Promise.reject(),
    delete: () => Promise.reject(),
  };

  console.log(dataProvider);

  return (
    <Admin dataProvider={dataProvider}>
      <Resource name="users" list={UserList} />
      <Resource name="characters" list={CharacterList} />
    </Admin>
  );
}

export default App;
