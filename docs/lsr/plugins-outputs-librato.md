---
navigation_title: librato
mapped_pages:
  - https://www.elastic.co/guide/en/logstash/current/plugins-outputs-librato.html

---

# Librato output plugin

* Plugin version: v3.0.6 ([Other versions](/vpr/output-librato-index.md))
* Released on: 2018-04-06
* [Changelog](https://github.com/logstash-plugins/logstash-output-librato/blob/v3.0.6/CHANGELOG.md)





## Getting help [_getting_help]

For questions about the plugin, open a topic in the [Discuss](http://discuss.elastic.co) forums. For bugs or feature requests, open an issue in [Github](https://github.com/logstash-plugins/logstash-output-librato). For the list of Elastic supported plugins, please consult the [Elastic Support Matrix](https://www.elastic.co/support/matrix#matrix_logstash_plugins).

## Description [_description]

This output lets you send metrics, annotations, and alerts to Librato based on Logstash events

This is VERY experimental and inefficient right now.

## Librato Output Configuration Options [plugins-outputs-librato-options]

This plugin supports the following configuration options plus the [Common options](plugins-outputs-librato.md#plugins-outputs-librato-common-options) described later.

| Setting | Input type | Required |
| :- | :- | :- |
| [`account_id`](plugins-outputs-librato.md#plugins-outputs-librato-account_id) | [string](/lsr/value-types.md#string) | Yes |
| [`annotation`](plugins-outputs-librato.md#plugins-outputs-librato-annotation) | [hash](/lsr/value-types.md#hash) | No |
| [`api_token`](plugins-outputs-librato.md#plugins-outputs-librato-api_token) | [string](/lsr/value-types.md#string) | Yes |
| [`batch_size`](plugins-outputs-librato.md#plugins-outputs-librato-batch_size) | [string](/lsr/value-types.md#string) | No |
| [`counter`](plugins-outputs-librato.md#plugins-outputs-librato-counter) | [hash](/lsr/value-types.md#hash) | No |
| [`gauge`](plugins-outputs-librato.md#plugins-outputs-librato-gauge) | [hash](/lsr/value-types.md#hash) | No |

Also see [Common options](plugins-outputs-librato.md#plugins-outputs-librato-common-options) for a list of options supported by all output plugins.

### `account_id` [plugins-outputs-librato-account_id]

* This is a required setting.
* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

Your Librato account usually an email address

### `annotation` [plugins-outputs-librato-annotation]

* Value type is [hash](/lsr/value-types.md#hash)
* Default value is `{}`

Annotations Registers an annotation with Librato The only required field is `title` and `name`. `start_time` and `end_time` will be set to `event.get("@timestamp").to_i` You can add any other optional annotation values as well. All values will be passed through `event.sprintf`

Example:

```
  {
      "title" => "Logstash event on %{host}"
      "name" => "logstash_stream"
  }
or
[source,ruby]
   {
      "title" => "Logstash event"
      "description" => "%{message}"
      "name" => "logstash_stream"
   }
```

### `api_token` [plugins-outputs-librato-api_token]

* This is a required setting.
* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

Your Librato API Token

### `batch_size` [plugins-outputs-librato-batch_size]

* Value type is [string](/lsr/value-types.md#string)
* Default value is `"10"`

Batch size Number of events to batch up before sending to Librato.

### `counter` [plugins-outputs-librato-counter]

* Value type is [hash](/lsr/value-types.md#hash)
* Default value is `{}`

Counters Send data to Librato as a counter

Example:

```
    {
        "value" => "1"
        "source" => "%{host}"
        "name" => "messages_received"
    }
```

Additionally, you can override the `measure_time` for the event. Must be a unix timestamp:

```
    {
        "value" => "1"
        "source" => "%{host}"
        "name" => "messages_received"
        "measure_time" => "%{my_unixtime_field}"
    }
Default is to use the event's timestamp
```

### `gauge` [plugins-outputs-librato-gauge]

* Value type is [hash](/lsr/value-types.md#hash)
* Default value is `{}`

Gauges Send data to Librato as a gauge

Example:

```
    {
        "value" => "%{bytes_received}"
        "source" => "%{host}"
        "name" => "apache_bytes"
    }
Additionally, you can override the `measure_time` for the event. Must be a unix timestamp:
[source,ruby]
    {
        "value" => "%{bytes_received}"
        "source" => "%{host}"
        "name" => "apache_bytes"
        "measure_time" => "%{my_unixtime_field}
    }
Default is to use the event's timestamp
```

## Common options [plugins-outputs-librato-common-options]

These configuration options are supported by all output plugins:

| Setting | Input type | Required |
| :- | :- | :- |
| [`codec`](plugins-outputs-librato.md#plugins-outputs-librato-codec) | [codec](/lsr/value-types.md#codec) | No |
| [`enable_metric`](plugins-outputs-librato.md#plugins-outputs-librato-enable_metric) | [boolean](/lsr/value-types.md#boolean) | No |
| [`id`](plugins-outputs-librato.md#plugins-outputs-librato-id) | [string](/lsr/value-types.md#string) | No |

### `codec` [plugins-outputs-librato-codec]

* Value type is [codec](/lsr/value-types.md#codec)
* Default value is `"plain"`

The codec used for output data. Output codecs are a convenient method for encoding your data before it leaves the output without needing a separate filter in your Logstash pipeline.

### `enable_metric` [plugins-outputs-librato-enable_metric]

* Value type is [boolean](/lsr/value-types.md#boolean)
* Default value is `true`

Disable or enable metric logging for this specific plugin instance. By default we record all the metrics we can, but you can disable metrics collection for a specific plugin.

### `id` [plugins-outputs-librato-id]

* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

Add a unique `ID` to the plugin configuration. If no ID is specified, Logstash will generate one. It is strongly recommended to set this ID in your configuration. This is particularly useful when you have two or more plugins of the same type. For example, if you have 2 librato outputs. Adding a named ID in this case will help in monitoring Logstash when using the monitoring APIs.

```
output {
  librato {
    id => "my_plugin_id"
  }
}
```
