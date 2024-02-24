import { getUserCharacters, getUsers } from '@/app/_features/fetchAPI'
import { Character, User, UserCharacter } from '@/app/_types'

interface InitializeHelperDataProps {
  token: string
  setUserCharacters: (characters: Character[]) => void
  setUserCharactersList: (userCharactersList: UserCharacter[]) => void
  setCurrentUser: (user: User) => void
  setIsLoading: (isLoading: boolean) => void
}

const InitializeHelperData = ({
  token,
  setUserCharacters,
  setUserCharactersList,
  setCurrentUser,
  setIsLoading,
}: InitializeHelperDataProps) => {
  void (async () => {
    setIsLoading(true)
    try {
      const userCharactersData = await getUserCharacters(token, 'user')
      const userData = await getUsers(token, 'current_user')
      setUserCharacters(userCharactersData.charactersData)
      setUserCharactersList(userCharactersData.user_characters)
      setCurrentUser(userData.current_user)
    } catch (error) {
      console.error('Error fetching initial data', error)
    } finally {
      setIsLoading(false)
    }
  })()
}

export { InitializeHelperData }
