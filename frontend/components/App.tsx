import * as React from "react";
import * as firebase from "firebase/app";
import { Container, Header, Tab } from "semantic-ui-react";
import { EditForm } from "./EditForm";
import { ImageList } from "./ImageList";
import { AccountButton } from "./AccountButton";
import { Messages } from "./Messages";
import { ImageGenerateForm } from "./ImageGenerateForm";
import { ImageStorage } from "../ImageStorage";
import { config } from "../config";

const worldUrl = "vrchat://launch?ref=vrchat.com&id=wrld_61996a4b-c96c-4688-bc98-39224491a8b0:0";

const imageStorage = new ImageStorage(config);

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
            <p>
                VRChatワールド <a href={worldUrl}>美少女ゲームツクール2020 ⁄ ADV-MAKER 2020</a> に表示されます。
            </p>
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
                                        <Messages
                                            user={user}
                                            saved={saved}
                                            setValues={setValues}
                                            imageStorage={imageStorage}
                                        />
                                    </Tab.Pane>
                                ),
                            },
                        ]}
                    />
                    <ImageGenerateForm
                        index={index}
                        onSaved={() => setSaved(true)}
                        values={values}
                        imageStorage={imageStorage}
                    />
                </>
            )}
            <ImageList index={index} setIndex={setIndex} saved={saved} imageStorage={imageStorage} />
            <p>
                このメーカーで生成した画像はパブリックドメインになります。このメーカーではVL Pゴシックを利用しています。
                <a href="http://vlgothic.dicey.org/license.html">フォントのライセンス</a>
            </p>
        </Container>
    );
};
