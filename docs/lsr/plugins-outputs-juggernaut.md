---
navigation_title: juggernaut
mapped_pages:
  - https://www.elastic.co/guide/en/logstash/current/plugins-outputs-juggernaut.html
applies_to:
  stack: ga

---

# Juggernaut output plugin

* Plugin version: v3.0.6 ([Other versions](/vpr/output-juggernaut-index.md))
* Released on: 2018-04-06
* [Changelog](https://github.com/logstash-plugins/logstash-output-juggernaut/blob/v3.0.6/CHANGELOG.md)





## Getting help [_getting_help]

For questions about the plugin, open a topic in the [Discuss](http://discuss.elastic.co) forums. For bugs or feature requests, open an issue in [Github](https://github.com/logstash-plugins/logstash-output-juggernaut). For the list of Elastic supported plugins, please consult the [Elastic Support Matrix](https://www.elastic.co/support/matrix#matrix_logstash_plugins).

## Description [_description]

Push messages to the juggernaut websockets server:

* <https://github.com/maccman/juggernaut>

Wraps Websockets and supports other methods (including xhr longpolling) This is basically, just an extension of the redis output (Juggernaut pulls messages from redis). But it pushes messages to a particular channel and formats the messages in the way juggernaut expects.

## Juggernaut Output Configuration Options [plugins-outputs-juggernaut-options]

This plugin supports the following configuration options plus the [Common options](plugins-outputs-juggernaut.md#plugins-outputs-juggernaut-common-options) described later.

| Setting | Input type | Required |
| :- | :- | :- |
| [`channels`](plugins-outputs-juggernaut.md#plugins-outputs-juggernaut-channels) | [array](/lsr/value-types.md#array) | Yes |
| [`db`](plugins-outputs-juggernaut.md#plugins-outputs-juggernaut-db) | [number](/lsr/value-types.md#number) | No |
| [`host`](plugins-outputs-juggernaut.md#plugins-outputs-juggernaut-host) | [string](/lsr/value-types.md#string) | No |
| [`message_format`](plugins-outputs-juggernaut.md#plugins-outputs-juggernaut-message_format) | [string](/lsr/value-types.md#string) | No |
| [`password`](plugins-outputs-juggernaut.md#plugins-outputs-juggernaut-password) | [password](/lsr/value-types.md#password) | No |
| [`port`](plugins-outputs-juggernaut.md#plugins-outputs-juggernaut-port) | [number](/lsr/value-types.md#number) | No |
| [`timeout`](plugins-outputs-juggernaut.md#plugins-outputs-juggernaut-timeout) | [number](/lsr/value-types.md#number) | No |

Also see [Common options](plugins-outputs-juggernaut.md#plugins-outputs-juggernaut-common-options) for a list of options supported by all output plugins.

### `channels` [plugins-outputs-juggernaut-channels]

* This is a required setting.
* Value type is [array](/lsr/value-types.md#array)
* There is no default value for this setting.

List of channels to which to publish. Dynamic names are valid here, for example `logstash-%{type}`.

### `db` [plugins-outputs-juggernaut-db]

* Value type is [number](/lsr/value-types.md#number)
* Default value is `0`

The redis database number.

### `host` [plugins-outputs-juggernaut-host]

* Value type is [string](/lsr/value-types.md#string)
* Default value is `"127.0.0.1"`

The hostname of the redis server to which juggernaut is listening.

### `message_format` [plugins-outputs-juggernaut-message_format]

* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

How should the message be formatted before pushing to the websocket.

### `password` [plugins-outputs-juggernaut-password]

* Value type is [password](/lsr/value-types.md#password)
* There is no default value for this setting.

Password to authenticate with. There is no authentication by default.

### `port` [plugins-outputs-juggernaut-port]

* Value type is [number](/lsr/value-types.md#number)
* Default value is `6379`

The port to connect on.

### `timeout` [plugins-outputs-juggernaut-timeout]

* Value type is [number](/lsr/value-types.md#number)
* Default value is `5`

Redis initial connection timeout in seconds.

## Common options [plugins-outputs-juggernaut-common-options]

These configuration options are supported by all output plugins:

| Setting | Input type | Required |
| :- | :- | :- |
| [`codec`](plugins-outputs-juggernaut.md#plugins-outputs-juggernaut-codec) | [codec](/lsr/value-types.md#codec) | No |
| [`enable_metric`](plugins-outputs-juggernaut.md#plugins-outputs-juggernaut-enable_metric) | [boolean](/lsr/value-types.md#boolean) | No |
| [`id`](plugins-outputs-juggernaut.md#plugins-outputs-juggernaut-id) | [string](/lsr/value-types.md#string) | No |

### `codec` [plugins-outputs-juggernaut-codec]

* Value type is [codec](/lsr/value-types.md#codec)
* Default value is `"plain"`

The codec used for output data. Output codecs are a convenient method for encoding your data before it leaves the output without needing a separate filter in your Logstash pipeline.

### `enable_metric` [plugins-outputs-juggernaut-enable_metric]

* Value type is [boolean](/lsr/value-types.md#boolean)
* Default value is `true`

Disable or enable metric logging for this specific plugin instance. By default we record all the metrics we can, but you can disable metrics collection for a specific plugin.

### `id` [plugins-outputs-juggernaut-id]

* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

Add a unique `ID` to the plugin configuration. If no ID is specified, Logstash will generate one. It is strongly recommended to set this ID in your configuration. This is particularly useful when you have two or more plugins of the same type. For example, if you have 2 juggernaut outputs. Adding a named ID in this case will help in monitoring Logstash when using the monitoring APIs.

```
output {
  juggernaut {
    id => "my_plugin_id"
  }
}
```
