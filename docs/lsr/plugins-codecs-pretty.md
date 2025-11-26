---
navigation_title: pretty
mapped_pages:
  - https://www.elastic.co/guide/en/logstash/current/plugins-codecs-pretty.html
applies_to:
  stack: ga

---

# Pretty codec plugin

* Plugin version: v1.0.1 ([Other versions](/vpr/codec-pretty-index.md))
* Released on: 2017-08-15
* [Changelog](https://github.com/logstash-plugins/logstash-codec-pretty/blob/v1.0.1/CHANGELOG.md)





## Getting help [_getting_help]

For questions about the plugin, open a topic in the [Discuss](http://discuss.elastic.co) forums. For bugs or feature requests, open an issue in [Github](https://github.com/logstash-plugins/logstash-codec-pretty). For the list of Elastic supported plugins, please consult the [Elastic Support Matrix](https://www.elastic.co/support/matrix#matrix_logstash_plugins).

## Description [_description]

The Pretty codec will pretty print your event data using the Ruby Awesome Print library.

## Pretty Codec Configuration Options [plugins-codecs-pretty-options]

| Setting | Input type | Required |
| :- | :- | :- |
| [`metadata`](plugins-codecs-pretty.md#plugins-codecs-pretty-metadata) | [boolean](/lsr/value-types.md#boolean) | No |

### `metadata` [plugins-codecs-pretty-metadata]

* Value type is [boolean](/lsr/value-types.md#boolean)
* Default value is `false`

Should the event’s metadata be included in the output?
