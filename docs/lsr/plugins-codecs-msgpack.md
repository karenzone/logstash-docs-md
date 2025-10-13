---
navigation_title: msgpack
mapped_pages:
  - https://www.elastic.co/guide/en/logstash/current/plugins-codecs-msgpack.html
applies_to:
  stack: ga

---

# Msgpack codec plugin

* Plugin version: v3.1.0 ([Other versions](/vpr/codec-msgpack-index.md))
* Released on: 2021-08-09
* [Changelog](https://github.com/logstash-plugins/logstash-codec-msgpack/blob/v3.1.0/CHANGELOG.md)





## Getting help [_getting_help]

For questions about the plugin, open a topic in the [Discuss](http://discuss.elastic.co) forums. For bugs or feature requests, open an issue in [Github](https://github.com/logstash-plugins/logstash-codec-msgpack). For the list of Elastic supported plugins, please consult the [Elastic Support Matrix](https://www.elastic.co/support/matrix#matrix_logstash_plugins).

## Description [_description]

This codec reads and produces MessagePack encoded content.

## Msgpack Codec configuration options [plugins-codecs-msgpack-options]

| Setting | Input type | Required |
| :- | :- | :- |
| [`format`](plugins-codecs-msgpack.md#plugins-codecs-msgpack-format) | [string](/lsr/value-types.md#string) | No |
| [`target`](plugins-codecs-msgpack.md#plugins-codecs-msgpack-target) | [string](/lsr/value-types.md#string) | No |

### `format` [plugins-codecs-msgpack-format]

* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

### `target` [plugins-codecs-msgpack-target]

* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

Define the target field for placing the decoded values. If this setting is not set, data will be stored at the root (top level) of the event.

For example, if you want data to be put under the `document` field:

```
    input {
      tcp {
        port => 4242
        codec => msgpack {
          target => "[document]"
        }
      }
    }
```
