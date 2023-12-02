# アプリ側で用意するテンプレートのデータ
templates = [
  {name: '国内旅行（春）', query_text: '春におすすめの国内旅行先は？'},
  {name: '国内旅行（夏）', query_text: '夏におすすめの国内旅行先は？'},
  {name: '国内旅行（秋）', query_text: '秋におすすめの国内旅行先は？'},
  {name: '国内旅行（冬）', query_text: '冬におすすめの国内旅行先は？'},
  {name: '海外旅行（春）', query_text: '春におすすめの海外旅行先は？'},
  {name: '海外旅行（夏）', query_text: '夏におすすめの海外旅行先は？'},
  {name: '海外旅行（秋）', query_text: '秋におすすめの海外旅行先は？'},
  {name: '海外旅行（冬）', query_text: '冬におすすめの海外旅行先は？'},
  {name: '趣味探し（インドア）', query_text: 'おすすめのインドア趣味は？'},
  {name: '趣味探し（アウトドア）', query_text: 'おすすめのアウトドア趣味は？'},
  {name: 'リスキリング', query_text: '未経験からリスキリングするのにおすすめの技術・知識は？'},
  {name: 'プログラミング言語', query_text: '初心者におすすめのプログラミング言語は？'},
]

templates.each do |template|
  Template.create(template)
end