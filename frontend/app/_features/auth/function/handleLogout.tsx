import axios from 'axios'
import { signOut } from 'next-auth/react'

export const handleLogout = async () => {
  sessionStorage.setItem('unAuthFlag', 'true')
  try {
    await signOut()
    const destroySession = await axios({
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_API_URL}/auth/google/logout`,
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      withCredentials: true,
    })

    if (destroySession.status === 200) {
      console.log('Session destroyed successfully')
    } else {
      console.error('Error destroying session', destroySession)
    }
  } catch (error) {
    console.error('Catch error', error)
  }
}
