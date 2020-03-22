import * as React from "react";
import { Grid, Form, Pagination, Button } from "semantic-ui-react";
import { getAllMessages, deleteMessage, Message } from "../ImageStorage";

export interface MessagesProps {
    user: firebase.User | null;
    saved: boolean;
    setValues: (values: string[]) => any;
}

const pagePer = 12;

export const Messages: React.FC<MessagesProps> = function Messages({ user, saved, setValues }) {
    const [filterMine, toggleFilterMine] = React.useReducer((prev: boolean) => !prev, false);
    const [search, setSearch] = React.useState("");
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [filteredMessages, setFilteredMessages] = React.useState<Message[]>([]);
    const [page, setPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);
    const [tryDelete, setTryDelete] = React.useState<string | undefined>();

    React.useEffect(() => {
        if (user && saved) {
            getAllMessages().then(msgs => setMessages(msgs));
        }
    }, [saved]);

    React.useEffect(() => {
        if (user) {
            getAllMessages().then(msgs => setMessages(msgs));
        }
    }, [user]);

    React.useEffect(() => {
        if (tryDelete) {
            const id = tryDelete;
            deleteMessage(id)
                .then(() => getAllMessages())
                .then(msgs => {
                    setMessages(msgs);
                    setTryDelete(undefined);
                });
        }
    }, [tryDelete]);

    React.useEffect(() => {
        const nextFilteredMessages = messages.filter(
            message =>
                message.values.some(value => value?.includes(search)) &&
                (!filterMine || !user || message.uid === user.uid),
        );
        setFilteredMessages(nextFilteredMessages);

        const nextTotalPages = Math.ceil(nextFilteredMessages.length / pagePer);
        setTotalPages(nextTotalPages);

        if (page > nextTotalPages) setPage(nextTotalPages || 1);
    }, [messages, search, filterMine, saved]);

    if (!user) return <></>;

    const pagedMessages = filteredMessages.slice((page - 1) * pagePer, page * pagePer);

    return (
        <>
            <Grid columns={1}>
                <Grid.Column>
                    <Form>
                        <Form.Checkbox
                            label="自分の投稿のみ"
                            checked={filterMine}
                            onChange={() => toggleFilterMine()}
                        />
                        <Form.Input
                            type="search"
                            label="検索"
                            value={search}
                            onChange={(_, { value }) => setSearch(value)}
                        />
                    </Form>
                </Grid.Column>
                <Grid.Column>
                    <Grid columns={3} doubling stackable>
                        {pagedMessages.map(message => (
                            <Grid.Column key={message.id}>
                                {message.values.map((value, i) => (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <p key={i}>{value}</p>
                                ))}
                                <Button primary type="button" onClick={() => setValues(message.values)}>
                                    適用
                                </Button>
                                {user.uid === message.uid && (
                                    <Button
                                        disabled={!!tryDelete}
                                        color="red"
                                        type="button"
                                        onClick={() => setTryDelete(message.id)}
                                    >
                                        削除
                                    </Button>
                                )}
                            </Grid.Column>
                        ))}
                    </Grid>
                </Grid.Column>
                <Grid.Column>
                    <Pagination
                        totalPages={totalPages}
                        activePage={page}
                        onPageChange={(_, { activePage }) => setPage(activePage as number)}
                    />
                </Grid.Column>
            </Grid>
        </>
    );
};
