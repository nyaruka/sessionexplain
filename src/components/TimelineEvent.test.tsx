import * as React from 'react';
import { TimelineEvent } from './TimelineEvent';
import { mount, configure } from 'enzyme';
import ReactSixteenAdapter from 'enzyme-adapter-react-16';

configure({ adapter: new ReactSixteenAdapter() });

it('renders appropriate summary for different event types', () => {
    const tests: { event: any, summary: string }[] = [
        {
            event: {
                type: "contact_language_changed",
                language: ""
            },
            summary: "🌐 language cleared"
        },
        {
            event: {
                type: "contact_language_changed",
                language: "fra"
            },
            summary: "🌐 language changed to fra"
        },
        {
            event: {
                type: "contact_name_changed",
                name: ""
            },
            summary: "📛 name cleared"
        },
        {
            event: {
                type: "contact_name_changed",
                name: "Jimmy"
            },
            summary: "📛 name changed to Jimmy"
        },
        {
            event: {
                type: "contact_refreshed"
            },
            summary: "👤 contact refreshed on resume"
        },
        {
            event: {
                type: "contact_timezone_changed",
                timezone: ""
            },
            summary: "🕑 timezone cleared"
        },
        {
            event: {
                type: "contact_timezone_changed",
                timezone: "Africa/Kigali"
            },
            summary: "🕑 timezone changed to Africa/Kigali"
        },
        {
            event: {
                type: "environment_refreshed"
            },
            summary: "⚙️ environment refreshed on resume"
        },
        {
            event: {
                type: "error",
                text: "I'm an error"
            },
            summary: "⚠️ I'm an error"
        },
        {
            event: {
                type: "email_created",
                subject: "Hi there",
                addresses: ["bob@nyaruka.com", "jim@nyaruka.com"]
            },
            summary: "✉️ email sent to bob@nyaruka.com, jim@nyaruka.com"
        },
        {
            event: {
                type: "email_sent",
                subject: "Hi there",
                to: ["bob@nyaruka.com", "jim@nyaruka.com"]
            },
            summary: "✉️ email sent to bob@nyaruka.com, jim@nyaruka.com with subject Hi there"
        },
        {
            event: {
                type: "failure",
                text: "I'm a failure"
            },
            summary: "⚰️ I'm a failure"
        },
        {
            event: {
                type: "run_expired"
            },
            summary: "📆 exiting due to expiration"
        },
        {
            event: {
                type: "wait_timed_out"
            },
            summary: "⏲️ resuming due to wait timeout"
        },
        {
            event: {
                type: "webhook_called",
                url: "http://example.com/",
                status: "success",
                elapsed_ms: 123,
                request: "GET / HTTP/1.1",
                response: "HTTP/1.1 200 OK\r\n\r\n{\"ip\":\"190.154.48.130\"}"
            },
            summary: "☁️ called http://example.com/"
        },
        {
            event: {
                type: "webhook_called",
                url: "http://example.com/this/is/a/long/url/and/will/be/truncated/if/this/test/passes/ok/?foo=bar&things=something&otherthings=somethingelse",
                status: "success",
                elapsed_ms: 123,
                request: "GET /this/is/a/long/url/and/will/be/truncated/if/this/test/passes/ok/?foo=bar&things=something&otherthings=somethingelse HTTP/1.1",
                response: "HTTP/1.1 200 OK\r\n\r\n{\"ip\":\"190.154.48.130\"}"
            },
            summary: "☁️ called http://example.com/this/is/a/long/url/and/will/..."
        },
    ];

    for (let t = 0; t < tests.length; t++) {
        const wrapper = mount(<TimelineEvent event={tests[t].event} />);
        const info = wrapper.find('.Event');
        expect(info.render().find(".Event-header").text()).toBe(tests[t].summary);
    }
});
