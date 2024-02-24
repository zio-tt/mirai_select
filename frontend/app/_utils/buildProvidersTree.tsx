/* eslint-disable @typescript-eslint/no-explicit-any */
type ProviderComponent = React.FC<any>

const buildProvidersTree = (providers: ProviderComponent[]): ProviderComponent => {
  // 基本ケース：ContextProviderが1つしか残っていない場合、それを返して終了する
  if (providers.length === 1) {
    return providers[0]
  }

  // 配列から最初の2つのContextProviderを取り出す
  const FirstProvider = providers.shift()
  const SecondProvider = providers.shift()

  // 十分な数のContextProviderがあるかどうかを確認
  if (FirstProvider === undefined || SecondProvider === undefined) {
    throw new Error('ContextProviderが不足しています')
  }

  // 最初の2つのContextProviderをネストした新しいContextProviderを作成し、再帰する
  return buildProvidersTree([
    ({ children }) => (
      <FirstProvider>
        <SecondProvider>{children}</SecondProvider>
      </FirstProvider>
    ),
    ...providers,
  ])
}

export default buildProvidersTree
