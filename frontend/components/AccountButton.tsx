import * as React from "react";
import * as firebase from "firebase/app";
import { Button } from "semantic-ui-react";

export interface AccountButtonProps {
    user: firebase.User | null;
    setUser: (user: firebase.User | null) => any;
}

export const AccountButton: React.FC<AccountButtonProps> = function AccountButton({ user, setUser }) {
    const [loginAction, setLoginAction] = React.useState(false);
    const [logoutAction, setLogoutAction] = React.useState(false);
    React.useEffect(() => {
        if (loginAction) {
            setLoginAction(false);
            firebase
                .auth()
                .signInWithPopup(new firebase.auth.TwitterAuthProvider())
                // eslint-disable-next-line no-shadow
                .then(({ user }) => setUser(user));
        }
    }, [loginAction]);
    React.useEffect(() => {
        if (logoutAction) {
            setLogoutAction(false);
            firebase
                .auth()
                .signOut()
                .then(() => setUser(null));
        }
    }, [logoutAction]);

    return (
        <p>
            {user ? (
                <Button type="button" onClick={() => setLogoutAction(true)}>
                    ログアウト
                </Button>
            ) : (
                <Button type="button" onClick={() => setLoginAction(true)}>
                    Twitterでログインして編集
                </Button>
            )}
        </p>
    );
};
