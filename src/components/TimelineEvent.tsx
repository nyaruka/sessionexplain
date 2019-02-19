import * as React from 'react';
import { Event } from 'src/utils/GoFlow';

interface Props {
    event: Event;
}

interface State {
    showBody: boolean;
}

export class TimelineEvent extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = { showBody: false };

        this.handleToggleBody = this.handleToggleBody.bind(this);
    }

    handleToggleBody() {
        this.setState({ showBody: !this.state.showBody });
    }

    render() {
        const eventObj: any = this.props.event;
        const [emoji, summary] = this.renderType(this.props.event.type, eventObj);

        const body = { __html: "<pre>" + JSON.stringify(this.props.event, null, 2) + "</pre>" };
        const bodyElem = (
            <div dangerouslySetInnerHTML={body}></div>
        );
        const docsURL = `https://nyaruka.github.io/goflow/sessions.html#event:${this.props.event.type}`;

        return (
            <div className="Event">
                <div className="Event-header" onClick={this.handleToggleBody}>
                    {emoji}
                    &nbsp;
                    <span className="Event-summary">{summary}</span>
                </div>
                <div className="Event-body" style={this.state.showBody ? {} : { "display": "none" }}>
                    {bodyElem}
                    <div><a href={docsURL} target="_blank">Docs</a></div>
                </div>
            </div>
        );
    }

    // helper to return an emoji and a summary for each different event type
    renderType(typeName: string, event: any): [string, JSX.Element] {
        switch (typeName) {
            case "broadcast_created":
                const text: string = event.translations[event.base_language].text;
                return ["🔉", <>broadcasted <i>{text}</i> to ...</>]
            case "contact_field_changed":
                const msg = event.value ? <>changed to <i>{event.value.text}</i></> : "cleared";
                return ["✏️", <>field <i>{event.field.key}</i> {msg}</>];
            case "contact_groups_changed":
                var msgs: JSX.Element[] = [];
                if (event.groups_added) {
                    msgs.push(<span key={0}>added to {renderValList(event.groups_added)}</span>);
                }
                if (event.groups_removed) {
                    msgs.push(<span key={1}>removed from {renderValList(event.groups_removed)}</span>);
                }
                return ["👪", <>{joinElements(msgs)}</>];
            case "contact_language_changed":
                return ["🌐", <>language {event.language ? <>changed to <i>{event.language}</i></> : <>cleared</>}</>];
            case "contact_name_changed":
                return ["📛", <>name {event.name ? <>changed to <i>{event.name}</i></> : <>cleared</>}</>];
            case "contact_refreshed":
                return ["👤", <>contact refreshed on resume</>];
            case "contact_timezone_changed":
                return ["🕑", <>timezone {event.timezone ? <>changed to <i>{event.timezone}</i></> : <>cleared</>}</>];
            case "contact_urns_changed":
                return ["☎️", <>URNs changed to {renderValList(event.urns)}</>];
            case "email_created":
                return ["✉️", <>email sent to {renderValList(event.addresses)}</>];
            case "environment_refreshed":
                return ["⚙️", <>environment refreshed on resume</>];
            case "error":
                return ["⚠️", <span className="err">{event.text}</span>];
            case "flow_entered":
                return ["↪️", <>entered flow <i>{event.flow.name}</i></>];
            case "input_labels_added":
                return ["🏷️", <>labeled with {renderValList(event.labels)}</>];
            case "ivr_created":
                return ["📞", <>IVR created <span className="msg">{event.msg.text}</span></>];
            case "msg_created":
                return ["💬", <>message created <span className="msg">{event.msg.text}</span></>];
            case "msg_received":
                return ["📥", <>message received <span className="msg">{event.msg.text}</span></>];
            case "msg_wait":
                return ["⏳", <>waiting for message...</>];
            case "run_expired":
                return ["📆", <>exiting due to expiration</>];
            case "run_result_changed":
                return ["📈", <>run result <i>{event.name}</i> changed to <i>{event.value}</i></>];
            case "session_triggered":
                return ["🏁", <>session triggered for <i>{event.flow.name}</i></>];
            case "wait_timed_out":
                return ["⏲️", <>resuming due to wait timeout</>];
            case "webhook_called":
                const url = truncate(event.url, 50);
                return ["☁️", <>called <i>{url}</i></>];
        }
        return ["❓", <>{typeName}</>];
    }
}

function renderValList(items: any[]): JSX.Element[] {
    return joinElements(items.map((i, index) => <i key={index}>{typeof i.name == 'undefined' ? i : i.name}</i>))
}

// joins elements with the given separator which defaults to a comma
function joinElements(items: JSX.Element[], sep?: JSX.Element): JSX.Element[] {
    if (sep == null) {
        sep = <>, </>
    }
    let elements: JSX.Element[] = [];
    for (let i = 0; i < items.length; i++) {
        if (i > 0) {
            elements.push(sep);
        }
        elements.push(items[i]);
    }
    return elements;
}

function truncate(str: string, length: number, ending?: string) {
    if (ending == null) {
        ending = '...';
    }
    if (str.length > length) {
        return str.substring(0, length - ending.length) + ending;
    }
    return str;
}