---
navigation_title: pipe
mapped_pages:
  - https://www.elastic.co/guide/en/logstash/current/plugins-outputs-pipe.html

---

# Pipe output plugin

* Plugin version: v3.0.6 ([Other versions](/vpr/output-pipe-index.md))
* Released on: 2018-04-06
* [Changelog](https://github.com/logstash-plugins/logstash-output-pipe/blob/v3.0.6/CHANGELOG.md)





## Getting help [_getting_help]

For questions about the plugin, open a topic in the [Discuss](http://discuss.elastic.co) forums. For bugs or feature requests, open an issue in [Github](https://github.com/logstash-plugins/logstash-output-pipe). For the list of Elastic supported plugins, please consult the [Elastic Support Matrix](https://www.elastic.co/support/matrix#matrix_logstash_plugins).

## Description [_description]

Pipe output.

Pipe events to stdin of another program. You can use fields from the event as parts of the command. WARNING: This feature can cause logstash to fork off multiple children if you are not carefull with per-event commandline.

## Pipe Output Configuration Options [plugins-outputs-pipe-options]

This plugin supports the following configuration options plus the [Common options](plugins-outputs-pipe.md#plugins-outputs-pipe-common-options) described later.

| Setting | Input type | Required |
| :- | :- | :- |
| [`command`](plugins-outputs-pipe.md#plugins-outputs-pipe-command) | [string](/lsr/value-types.md#string) | Yes |
| [`message_format`](plugins-outputs-pipe.md#plugins-outputs-pipe-message_format) | [string](/lsr/value-types.md#string) | No |
| [`ttl`](plugins-outputs-pipe.md#plugins-outputs-pipe-ttl) | [number](/lsr/value-types.md#number) | No |

Also see [Common options](plugins-outputs-pipe.md#plugins-outputs-pipe-common-options) for a list of options supported by all output plugins.

### `command` [plugins-outputs-pipe-command]

* This is a required setting.
* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

Command line to launch and pipe to

### `message_format` [plugins-outputs-pipe-message_format]

* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

The format to use when writing events to the pipe. This value supports any string and can include `%{name}` and other dynamic strings.

If this setting is omitted, the full json representation of the event will be written as a single line.

### `ttl` [plugins-outputs-pipe-ttl]

* Value type is [number](/lsr/value-types.md#number)
* Default value is `10`

Close pipe that hasn’t been used for TTL seconds. -1 or 0 means never close.

## Common options [plugins-outputs-pipe-common-options]

These configuration options are supported by all output plugins:

| Setting | Input type | Required |
| :- | :- | :- |
| [`codec`](plugins-outputs-pipe.md#plugins-outputs-pipe-codec) | [codec](/lsr/value-types.md#codec) | No |
| [`enable_metric`](plugins-outputs-pipe.md#plugins-outputs-pipe-enable_metric) | [boolean](/lsr/value-types.md#boolean) | No |
| [`id`](plugins-outputs-pipe.md#plugins-outputs-pipe-id) | [string](/lsr/value-types.md#string) | No |

### `codec` [plugins-outputs-pipe-codec]

* Value type is [codec](/lsr/value-types.md#codec)
* Default value is `"plain"`

The codec used for output data. Output codecs are a convenient method for encoding your data before it leaves the output without needing a separate filter in your Logstash pipeline.

### `enable_metric` [plugins-outputs-pipe-enable_metric]

* Value type is [boolean](/lsr/value-types.md#boolean)
* Default value is `true`

Disable or enable metric logging for this specific plugin instance. By default we record all the metrics we can, but you can disable metrics collection for a specific plugin.

### `id` [plugins-outputs-pipe-id]

* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

Add a unique `ID` to the plugin configuration. If no ID is specified, Logstash will generate one. It is strongly recommended to set this ID in your configuration. This is particularly useful when you have two or more plugins of the same type. For example, if you have 2 pipe outputs. Adding a named ID in this case will help in monitoring Logstash when using the monitoring APIs.

```
output {
  pipe {
    id => "my_plugin_id"
  }
}
```
