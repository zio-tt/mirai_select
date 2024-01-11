import axios from 'axios'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

const apiCall = () => {
  // initial state
  const [ url, setUrl ] = useState<string>('')
  const [ method, setMethod ] = useState<string>('')
  const [ data, setData ] = useState<object>({})

  // response
  const [ response, setResponse ] = useState<object>({})

  // Authorization
  const { data: session, status } = useSession()
  const token = session?.appAccessToken

  const fetchAPI = async () => {
    try {
      const res = await axios({
        method: method,
        url: url,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${token}`
        },
        data: data,
        withCredentials: true,
      })
      if ( res.status === 200 ) {
        setResponse(res.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return {
    url,
    setUrl,
    method,
    setMethod,
    data,
    setData,
    response,
    fetchAPI
  }
}


const fetchInitData = async () => {
  try {
    const response = await axios({
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_API_URL}/helper/`,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true,
    });
    // responseが正常に取得できた時
    if (response.status === 200) {
      setUserData(response.data.user);
      setCharacterData(response.data.characters);
    }
  } catch (error) {
    addErrorMessages({
      message: 'ユーザー情報の取得に失敗しました。',
      kind: 'fetch'
    });
  }
}