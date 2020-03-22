import * as React from "react";
import { Form } from "./Form";
import { List } from "./List";

export const App: React.FC = function App() {
    const [index, setIndex] = React.useState(0);
    const [saved, setSaved] = React.useState(false);

    return (
        <div>
            <h1>ADVメッセージウインドウ画像メーカー</h1>
            <Form index={index} onSaved={() => setSaved(true)} />
            <List index={index} setIndex={setIndex} saved={saved} resetSaved={() => setSaved(false)} />
            <p>
                このメーカーで生成した画像はパブリックドメインになります。このメーカーではVL Pゴシックを利用しています。
                <a href="http://vlgothic.dicey.org/license.html">フォントのライセンス</a>
            </p>
        </div>
    );
};
