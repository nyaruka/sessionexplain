import * as React from 'react';
import { TimelineEvent } from './TimelineEvent';
import { ExplainStep } from 'utils/Explain';

interface Props {
    step: ExplainStep;
    index: number;
}

export class TimelineStep extends React.Component<Props> {

    public render() {
        const step = this.props.step;
        const events = step.events.map((event, i) =>
            <TimelineEvent event={event} key={`step${this.props.index}-event${i}`} />
        );
        const tooltip = `Node UUID: ${step.step.node_uuid}`;

        const cssClasses = ["Step-info"];
        if (step.isResume) {
            cssClasses.push("resumed");
        }
        if (!step.isComplete) {
            cssClasses.push("incomplete");
        }

        return (
            <div className="Frame-step">
                <div className={cssClasses.join(" ")} title={tooltip}>
                    <div></div>
                </div>
                <div className="Step-events">{events}</div>
            </div>
        )
    }
}