# csv-map-viewer README

VSCode 拡張機能である "csv-map-viewer" は、行によって列の意味が異なる仕様の CSV のためのビューワーです。

例えば、次のような Profile を表す行と、Address を表す行が混在する CSV ファイルがあるとき、この拡張機能は、現在のカーソルの列の意味が何であるかを教えてくれます。

```csv
A,John,john@gmail,Company1,0123456789
B,3374 Vitae Road,Merrickville-Wolford,88383,Ontario,Saint Martin
A,Alex,alex@gmail,Company2,1123456789
B,171-328 Pellentesque St.,Bhagalpur,3542 CJ,BR,Netherlands
0,a,b,c,d,e,f
```

![Screen_Shot_2021-04-29_at_21_49_55](https://user-images.githubusercontent.com/8636660/116554832-9b136600-a936-11eb-9f44-168686bbd13a.jpg)

## Features

初めに、Extension Settings で 列の意味を JSON で定義します。次の例は、先頭の列の値が `A` であるとき、2列目は `Name`、3列目は `Email` であることを定義しています。

````json
"A": {
    "0": { "title" : "A", "description": "A description" },
    "1": { "title" : "Names", "description": "Names description" },
    "2": { "title" : "Email", "description": "Email description" },
    "3": { "title" : "Company", "description": "Company description" },
    "4": { "title" : "Phone", "description": "Phone description" }
},
"B": { 
    // ... 
}
````

Editor を開き、コマンドパレットから `CSV Map Viewer: Show` を実行すると、左下のバーに、現在のカーソルがある列の意味が表示されます。

<img width="749" alt="Screen Shot 2021-04-29 at 22 07 30" src="https://user-images.githubusercontent.com/8636660/116556475-6ef8e480-a938-11eb-91a1-17b69710e25b.png">

![Screen_Shot_2021-04-29_at_21_49_55](https://user-images.githubusercontent.com/8636660/116554832-9b136600-a936-11eb-9f44-168686bbd13a.jpg)

![sample](https://user-images.githubusercontent.com/8636660/116559599-943b2200-a93b-11eb-9611-f7596fc69d0e.gif)


次に、コマンドパレットから `CSV Map Viewer: Output` を実行すると、Output Window の `CSV Map Viewer` の Output に、ファイル全体の情報を表示します。 

<img width="899" alt="Screen Shot 2021-04-29 at 22 08 16" src="https://user-images.githubusercontent.com/8636660/116556465-6d2f2100-a938-11eb-8d40-a3b990b8be77.png">



## Extension Settings

* `csv-map-viewer.map`(Object): CSV ファイルの各行ごとの列の意味を定義します

Example:

```json
"csv-map-viewer.map": {

    "YOUR FIRST COLUMN TEXT": {
        "0": { "title" : "column 0 title", "description": "" },
        "1": { "title" : "column 1 title", "description": "" }
    },
    "A": {
        "0": { "title" : "A", "description": "A description" },
        "1": { "title" : "Names", "description": "Names description" },
        "2": { "title" : "Email", "description": "Email description" },
        "3": { "title" : "Company", "description": "Company description" },
        "4": { "title" : "Phone", "description": "Phone description" }
    },
    "B": {
        "0": { "title" : "B", "description": "B description" },
        "1": { "title" : "Street Address", "description": "description-B-0" },
        "2": { "title" : "City", "description": "description-B-1" },
        "3": { "title" : "Zip", "description": "description-B-1" },
        "4": { "title" : "Region", "description": "description-B-1" },
        "5": { "title" : "Country", "description": "description-B-1" }
    }
}
```

## Known Issues

ダブルクォーテーションの中にある`,`の対応が行われていません。

## Release Notes



### 0.0.1

Initial release