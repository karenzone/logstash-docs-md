---
navigation_title: v1.0.1
mapped_pages:
  - https://www.elastic.co/guide/en/logstash-versioned-plugins/current/v1.0.1-plugins-codecs-pretty.html
applies_to:
  stack: ga
---

# Pretty codec plugin v1.0.1 [v1.0.1-plugins-codecs-pretty]

* Plugin version: v1.0.1
* Released on: 2017-08-15
* [Changelog](https://github.com/logstash-plugins/logstash-codec-pretty/blob/v1.0.1/CHANGELOG.md)

For other versions, see the [overview list](codec-pretty-index.md).

To learn more about Logstash, see the [Logstash Reference](https://www.elastic.co/guide/en/logstash/current/index.html).

## Getting help [_getting_help]

For questions about the plugin, open a topic in the [Discuss](http://discuss.elastic.co) forums. For bugs or feature requests, open an issue in [Github](https://github.com/logstash-plugins/logstash-codec-pretty). For the list of Elastic supported plugins, please consult the [Elastic Support Matrix](https://www.elastic.co/support/matrix#matrix_logstash_plugins).

## Description [_description]

The Pretty codec will pretty print your event data using the Ruby Awesome Print library.

## Pretty Codec Configuration Options [v1.0.1-plugins-codecs-pretty-options]

| Setting | Input type | Required |
| :- | :- | :- |
| [`metadata`](v1-0-1-plugins-codecs-pretty.md#v1.0.1-plugins-codecs-pretty-metadata) | [boolean](/lsr/value-types.md#boolean) | No |

### `metadata` [v1.0.1-plugins-codecs-pretty-metadata]

* Value type is [boolean](/lsr/value-types.md#boolean)
* Default value is `false`

Should the event’s metadata be included in the output?
