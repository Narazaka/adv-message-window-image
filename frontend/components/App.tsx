import * as React from "react";
import * as firebase from "firebase/app";
import { Container, Header, Tab } from "semantic-ui-react";
import { EditForm } from "./EditForm";
import { ImageList } from "./ImageList";
import { AccountButton } from "./AccountButton";
import { Messages } from "./Messages";
import { ImageGenerateForm } from "./ImageGenerateForm";

export const App: React.FC = function App() {
    const [values, setValues] = React.useState<string[]>([]);
    const setValue = React.useCallback(
        (index: number, value: string) => {
            const newValues = values.slice();
            newValues[index] = value;
            setValues(newValues);
        },
        [values],
    );
    const [index, setIndex] = React.useState(0);
    const [saved, setSaved] = React.useState(false);
    const [user, setUser] = React.useState(firebase.auth().currentUser);
    React.useEffect(() => {
        if (saved) setImmediate(() => setSaved(false));
    }, [saved]);

    return (
        <Container>
            <Header as="h1">ADVメッセージウインドウ画像メーカー</Header>
            <AccountButton user={user} setUser={setUser} />
            {!!user && (
                <>
                    <Tab
                        renderActiveOnly={false}
                        panes={[
                            {
                                menuItem: "編集",
                                pane: (
                                    <Tab.Pane key="edit">
                                        <EditForm values={values} setValue={setValue} />
                                    </Tab.Pane>
                                ),
                            },
                            {
                                menuItem: "履歴",
                                pane: (
                                    <Tab.Pane key="history">
                                        <Messages user={user} saved={saved} setValues={setValues} />
                                    </Tab.Pane>
                                ),
                            },
                        ]}
                    />
                    <ImageGenerateForm index={index} onSaved={() => setSaved(true)} values={values} />
                </>
            )}
            <ImageList index={index} setIndex={setIndex} saved={saved} />
            <p>
                このメーカーで生成した画像はパブリックドメインになります。このメーカーではVL Pゴシックを利用しています。
                <a href="http://vlgothic.dicey.org/license.html">フォントのライセンス</a>
            </p>
        </Container>
    );
};
