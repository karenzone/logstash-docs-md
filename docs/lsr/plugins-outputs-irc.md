---
navigation_title: irc
mapped_pages:
  - https://www.elastic.co/guide/en/logstash/current/plugins-outputs-irc.html
applies_to:
  stack: ga

---

# Irc output plugin

* Plugin version: v3.0.6 ([Other versions](/vpr/output-irc-index.md))
* Released on: 2018-04-06
* [Changelog](https://github.com/logstash-plugins/logstash-output-irc/blob/v3.0.6/CHANGELOG.md)





## Getting help [_getting_help]

For questions about the plugin, open a topic in the [Discuss](http://discuss.elastic.co) forums. For bugs or feature requests, open an issue in [Github](https://github.com/logstash-plugins/logstash-output-irc). For the list of Elastic supported plugins, please consult the [Elastic Support Matrix](https://www.elastic.co/support/matrix#matrix_logstash_plugins).

## Description [_description]

Write events to IRC

## Irc Output Configuration Options [plugins-outputs-irc-options]

This plugin supports the following configuration options plus the [Common options](plugins-outputs-irc.md#plugins-outputs-irc-common-options) described later.

| Setting | Input type | Required |
| :- | :- | :- |
| [`channels`](plugins-outputs-irc.md#plugins-outputs-irc-channels) | [array](/lsr/value-types.md#array) | Yes |
| [`format`](plugins-outputs-irc.md#plugins-outputs-irc-format) | [string](/lsr/value-types.md#string) | No |
| [`host`](plugins-outputs-irc.md#plugins-outputs-irc-host) | [string](/lsr/value-types.md#string) | Yes |
| [`messages_per_second`](plugins-outputs-irc.md#plugins-outputs-irc-messages_per_second) | [number](/lsr/value-types.md#number) | No |
| [`nick`](plugins-outputs-irc.md#plugins-outputs-irc-nick) | [string](/lsr/value-types.md#string) | No |
| [`password`](plugins-outputs-irc.md#plugins-outputs-irc-password) | [password](/lsr/value-types.md#password) | No |
| [`port`](plugins-outputs-irc.md#plugins-outputs-irc-port) | [number](/lsr/value-types.md#number) | No |
| [`post_string`](plugins-outputs-irc.md#plugins-outputs-irc-post_string) | [string](/lsr/value-types.md#string) | No |
| [`pre_string`](plugins-outputs-irc.md#plugins-outputs-irc-pre_string) | [string](/lsr/value-types.md#string) | No |
| [`real`](plugins-outputs-irc.md#plugins-outputs-irc-real) | [string](/lsr/value-types.md#string) | No |
| [`secure`](plugins-outputs-irc.md#plugins-outputs-irc-secure) | [boolean](/lsr/value-types.md#boolean) | No |
| [`user`](plugins-outputs-irc.md#plugins-outputs-irc-user) | [string](/lsr/value-types.md#string) | No |

Also see [Common options](plugins-outputs-irc.md#plugins-outputs-irc-common-options) for a list of options supported by all output plugins.

### `channels` [plugins-outputs-irc-channels]

* This is a required setting.
* Value type is [array](/lsr/value-types.md#array)
* There is no default value for this setting.

Channels to broadcast to.

These should be full channel names including the *#* symbol, such as "#logstash".

### `format` [plugins-outputs-irc-format]

* Value type is [string](/lsr/value-types.md#string)
* Default value is `"%{message}"`

Message format to send, event tokens are usable here

### `host` [plugins-outputs-irc-host]

* This is a required setting.
* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

Address of the host to connect to

### `messages_per_second` [plugins-outputs-irc-messages_per_second]

* Value type is [number](/lsr/value-types.md#number)
* Default value is `0.5`

Limit the rate of messages sent to IRC in messages per second.

### `nick` [plugins-outputs-irc-nick]

* Value type is [string](/lsr/value-types.md#string)
* Default value is `"logstash"`

IRC Nickname

### `password` [plugins-outputs-irc-password]

* Value type is [password](/lsr/value-types.md#password)
* There is no default value for this setting.

IRC server password

### `port` [plugins-outputs-irc-port]

* Value type is [number](/lsr/value-types.md#number)
* Default value is `6667`

Port on host to connect to.

### `post_string` [plugins-outputs-irc-post_string]

* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

Static string after event

### `pre_string` [plugins-outputs-irc-pre_string]

* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

Static string before event

### `real` [plugins-outputs-irc-real]

* Value type is [string](/lsr/value-types.md#string)
* Default value is `"logstash"`

IRC Real name

### `secure` [plugins-outputs-irc-secure]

* Value type is [boolean](/lsr/value-types.md#boolean)
* Default value is `false`

Set this to true to enable SSL.

### `user` [plugins-outputs-irc-user]

* Value type is [string](/lsr/value-types.md#string)
* Default value is `"logstash"`

IRC Username

## Common options [plugins-outputs-irc-common-options]

These configuration options are supported by all output plugins:

| Setting | Input type | Required |
| :- | :- | :- |
| [`codec`](plugins-outputs-irc.md#plugins-outputs-irc-codec) | [codec](/lsr/value-types.md#codec) | No |
| [`enable_metric`](plugins-outputs-irc.md#plugins-outputs-irc-enable_metric) | [boolean](/lsr/value-types.md#boolean) | No |
| [`id`](plugins-outputs-irc.md#plugins-outputs-irc-id) | [string](/lsr/value-types.md#string) | No |

### `codec` [plugins-outputs-irc-codec]

* Value type is [codec](/lsr/value-types.md#codec)
* Default value is `"plain"`

The codec used for output data. Output codecs are a convenient method for encoding your data before it leaves the output without needing a separate filter in your Logstash pipeline.

### `enable_metric` [plugins-outputs-irc-enable_metric]

* Value type is [boolean](/lsr/value-types.md#boolean)
* Default value is `true`

Disable or enable metric logging for this specific plugin instance. By default we record all the metrics we can, but you can disable metrics collection for a specific plugin.

### `id` [plugins-outputs-irc-id]

* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

Add a unique `ID` to the plugin configuration. If no ID is specified, Logstash will generate one. It is strongly recommended to set this ID in your configuration. This is particularly useful when you have two or more plugins of the same type. For example, if you have 2 irc outputs. Adding a named ID in this case will help in monitoring Logstash when using the monitoring APIs.

```
output {
  irc {
    id => "my_plugin_id"
  }
}
```
