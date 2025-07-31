---
navigation_title: boundary
mapped_pages:
  - https://www.elastic.co/guide/en/logstash/current/plugins-outputs-boundary.html

---

# Boundary output plugin

* Plugin version: v3.0.6 ([Other versions](/vpr/output-boundary-index.md))
* Released on: 2023-05-30
* [Changelog](https://github.com/logstash-plugins/logstash-output-boundary/blob/v3.0.6/CHANGELOG.md)





## Getting help [_getting_help]

For questions about the plugin, open a topic in the [Discuss](http://discuss.elastic.co) forums. For bugs or feature requests, open an issue in [Github](https://github.com/logstash-plugins/logstash-output-boundary). For the list of Elastic supported plugins, please consult the [Elastic Support Matrix](https://www.elastic.co/support/matrix#matrix_logstash_plugins).

## Description [_description]

This output lets you send annotations to Boundary based on Logstash events

Note that since Logstash maintains no state these will be one-shot events

By default the start and stop time will be the event timestamp

## Boundary Output Configuration Options [plugins-outputs-boundary-options]

This plugin supports the following configuration options plus the [Common options](plugins-outputs-boundary.md#plugins-outputs-boundary-common-options) described later.

| Setting | Input type | Required |
| :- | :- | :- |
| [`api_key`](plugins-outputs-boundary.md#plugins-outputs-boundary-api_key) | [password](/lsr/value-types.md#password) | Yes |
| [`auto`](plugins-outputs-boundary.md#plugins-outputs-boundary-auto) | [boolean](/lsr/value-types.md#boolean) | No |
| [`bsubtype`](plugins-outputs-boundary.md#plugins-outputs-boundary-bsubtype) | [string](/lsr/value-types.md#string) | No |
| [`btags`](plugins-outputs-boundary.md#plugins-outputs-boundary-btags) | [array](/lsr/value-types.md#array) | No |
| [`btype`](plugins-outputs-boundary.md#plugins-outputs-boundary-btype) | [string](/lsr/value-types.md#string) | No |
| [`end_time`](plugins-outputs-boundary.md#plugins-outputs-boundary-end_time) | [string](/lsr/value-types.md#string) | No |
| [`org_id`](plugins-outputs-boundary.md#plugins-outputs-boundary-org_id) | [string](/lsr/value-types.md#string) | Yes |
| [`start_time`](plugins-outputs-boundary.md#plugins-outputs-boundary-start_time) | [string](/lsr/value-types.md#string) | No |

Also see [Common options](plugins-outputs-boundary.md#plugins-outputs-boundary-common-options) for a list of options supported by all output plugins.

### `api_key` [plugins-outputs-boundary-api_key]

* This is a required setting.
* Value type is [password](/lsr/value-types.md#password)
* There is no default value for this setting.

Your Boundary API key

### `auto` [plugins-outputs-boundary-auto]

* Value type is [boolean](/lsr/value-types.md#boolean)
* Default value is `false`

Auto If set to true, logstash will try to pull boundary fields out of the event. Any field explicitly set by config options will override these. `['type', 'subtype', 'creation_time', 'end_time', 'links', 'tags', 'loc']`

### `bsubtype` [plugins-outputs-boundary-bsubtype]

* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

Sub-Type

### `btags` [plugins-outputs-boundary-btags]

* Value type is [array](/lsr/value-types.md#array)
* There is no default value for this setting.

Tags Set any custom tags for this event Default are the Logstash tags if any

### `btype` [plugins-outputs-boundary-btype]

* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

Type

### `end_time` [plugins-outputs-boundary-end_time]

* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

End time Override the stop time Note that Boundary requires this to be seconds since epoch If overriding, it is your responsibility to type this correctly By default this is set to `event.get("@timestamp").to_i`

### `org_id` [plugins-outputs-boundary-org_id]

* This is a required setting.
* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

Your Boundary Org ID

### `start_time` [plugins-outputs-boundary-start_time]

* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

Start time Override the start time Note that Boundary requires this to be seconds since epoch If overriding, it is your responsibility to type this correctly By default this is set to `event.get("@timestamp").to_i`

## Common options [plugins-outputs-boundary-common-options]

These configuration options are supported by all output plugins:

| Setting | Input type | Required |
| :- | :- | :- |
| [`codec`](plugins-outputs-boundary.md#plugins-outputs-boundary-codec) | [codec](/lsr/value-types.md#codec) | No |
| [`enable_metric`](plugins-outputs-boundary.md#plugins-outputs-boundary-enable_metric) | [boolean](/lsr/value-types.md#boolean) | No |
| [`id`](plugins-outputs-boundary.md#plugins-outputs-boundary-id) | [string](/lsr/value-types.md#string) | No |

### `codec` [plugins-outputs-boundary-codec]

* Value type is [codec](/lsr/value-types.md#codec)
* Default value is `"plain"`

The codec used for output data. Output codecs are a convenient method for encoding your data before it leaves the output without needing a separate filter in your Logstash pipeline.

### `enable_metric` [plugins-outputs-boundary-enable_metric]

* Value type is [boolean](/lsr/value-types.md#boolean)
* Default value is `true`

Disable or enable metric logging for this specific plugin instance. By default we record all the metrics we can, but you can disable metrics collection for a specific plugin.

### `id` [plugins-outputs-boundary-id]

* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

Add a unique `ID` to the plugin configuration. If no ID is specified, Logstash will generate one. It is strongly recommended to set this ID in your configuration. This is particularly useful when you have two or more plugins of the same type. For example, if you have 2 boundary outputs. Adding a named ID in this case will help in monitoring Logstash when using the monitoring APIs.

```
output {
  boundary {
    id => "my_plugin_id"
  }
}
```
