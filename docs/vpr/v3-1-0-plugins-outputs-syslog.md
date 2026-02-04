---
navigation_title: v3.1.0
mapped_pages:
  - https://www.elastic.co/guide/en/logstash-versioned-plugins/current/v3.1.0-plugins-outputs-syslog.html
applies_to:
  stack: ga
---

# Syslog output plugin v3.1.0 [v3.1.0-plugins-outputs-syslog]

* Plugin version: v3.1.0
* Released on: 2025-12-23
* [Changelog](https://github.com/logstash-plugins/logstash-output-syslog/blob/v3.1.0/CHANGELOG.md)

For other versions, see the [overview list](output-syslog-index.md).

To learn more about Logstash, see the [Logstash Reference](https://www.elastic.co/guide/en/logstash/current/index.html).

## Getting help [_getting_help]

For questions about the plugin, open a topic in the [Discuss](http://discuss.elastic.co) forums. For bugs or feature requests, open an issue in [Github](https://github.com/logstash-plugins/logstash-output-syslog). For the list of Elastic supported plugins, please consult the [Elastic Support Matrix](https://www.elastic.co/support/matrix#matrix_logstash_plugins).

## Description [_description]

Send events to a syslog server.

You can send messages compliant with RFC3164 or RFC5424 using either UDP or TCP as the transport protocol.

By default the contents of the `message` field will be shipped as the free-form message text part of the emitted syslog message. If your messages don’t have a `message` field or if you for some other reason want to change the emitted message, modify the `message` configuration option.

## Syslog Output Configuration Options [v3.1.0-plugins-outputs-syslog-options]

This plugin supports the following configuration options plus the [Common options](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-common-options) and the [Deprecated Configuration Options](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-deprecated-options) described later.

| Setting | Input type | Required |
| :- | :- | :- |
| [`appname`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-appname) | [string](/lsr/value-types.md#string) | No |
| [`facility`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-facility) | [string](/lsr/value-types.md#string) | No |
| [`host`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-host) | [string](/lsr/value-types.md#string) | Yes |
| [`message`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-message) | [string](/lsr/value-types.md#string) | No |
| [`msgid`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-msgid) | [string](/lsr/value-types.md#string) | No |
| [`port`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-port) | [number](/lsr/value-types.md#number) | Yes |
| [`priority`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-priority) | [string](/lsr/value-types.md#string) | No |
| [`procid`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-procid) | [string](/lsr/value-types.md#string) | No |
| [`protocol`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-protocol) | [string](/lsr/value-types.md#string), one of `["tcp", "udp", "ssl-tcp"]` | No |
| [`reconnect_interval`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-reconnect_interval) | [number](/lsr/value-types.md#number) | No |
| [`rfc`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-rfc) | [string](/lsr/value-types.md#string), one of `["rfc3164", "rfc5424"]` | No |
| [`severity`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-severity) | [string](/lsr/value-types.md#string) | No |
| [`sourcehost`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-sourcehost) | [string](/lsr/value-types.md#string) | No |
| [`ssl_certificate`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-ssl_certificate) | a valid filesystem path | No |
| [`ssl_certificate_authorities`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-ssl_certificate_authorities) | [array](/lsr/value-types.md#array) | No |
| [`ssl_key`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-ssl_key) | a valid filesystem path | No |
| [`ssl_key_passphrase`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-ssl_key_passphrase) | [password](/lsr/value-types.md#password) | No |
| [`ssl_verify`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-ssl_verify) | [boolean](/lsr/value-types.md#boolean) | No |
| [`ssl_crl_path`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-ssl_crl_path) | a valid filesystem path | No |
| [`ssl_crl_check`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-ssl_crl_check) | [array](/lsr/value-types.md#array) | No |
| [`ssl_cipher_suites`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-ssl_cipher_suites) | [array](/lsr/value-types.md#array) | No |
| [`ssl_supported_protocols`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-ssl_supported_protocols) | [array](/lsr/value-types.md#array) | No |
| [`use_labels`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-use_labels) | [boolean](/lsr/value-types.md#boolean) | No |
| [`structured_data`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-structured_data) | [string](/lsr/value-types.md#string) | No |

Also see [Common options](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-common-options) for a list of options supported by all output plugins.

### `appname` [v3.1.0-plugins-outputs-syslog-appname]

* Value type is [string](/lsr/value-types.md#string)
* Default value is `"LOGSTASH"`

application name for syslog message. The new value can include `%{foo}` strings to help you build a new value from other parts of the event.

### `facility` [v3.1.0-plugins-outputs-syslog-facility]

* Value type is [string](/lsr/value-types.md#string)
* Default value is `"user-level"`

facility label for syslog message default fallback to user-level as in rfc3164 The new value can include `%{foo}` strings to help you build a new value from other parts of the event.

### `host` [v3.1.0-plugins-outputs-syslog-host]

* This is a required setting.
* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

syslog server address to connect to

### `message` [v3.1.0-plugins-outputs-syslog-message]

* Value type is [string](/lsr/value-types.md#string)
* Default value is `"%{message}"`

message text to log. The new value can include `%{foo}` strings to help you build a new value from other parts of the event.

### `msgid` [v3.1.0-plugins-outputs-syslog-msgid]

* Value type is [string](/lsr/value-types.md#string)
* Default value is `"-"`

message id for syslog message. The new value can include `%{foo}` strings to help you build a new value from other parts of the event.

### `port` [v3.1.0-plugins-outputs-syslog-port]

* This is a required setting.
* Value type is [number](/lsr/value-types.md#number)
* There is no default value for this setting.

syslog server port to connect to

### `priority` [v3.1.0-plugins-outputs-syslog-priority]

* Value type is [string](/lsr/value-types.md#string)
* Default value is `"%{syslog_pri}"`

syslog priority The new value can include `%{foo}` strings to help you build a new value from other parts of the event.

### `procid` [v3.1.0-plugins-outputs-syslog-procid]

* Value type is [string](/lsr/value-types.md#string)
* Default value is `"-"`

process id for syslog message. The new value can include `%{foo}` strings to help you build a new value from other parts of the event.

### `protocol` [v3.1.0-plugins-outputs-syslog-protocol]

* Value can be any of: `tcp`, `udp`, `ssl-tcp`
* Default value is `"udp"`

syslog server protocol. you can choose between udp, tcp and ssl/tls over tcp

### `reconnect_interval` [v3.1.0-plugins-outputs-syslog-reconnect_interval]

* Value type is [number](/lsr/value-types.md#number)
* Default value is `1`

when connection fails, retry interval in sec.

### `rfc` [v3.1.0-plugins-outputs-syslog-rfc]

* Value can be any of: `rfc3164`, `rfc5424`
* Default value is `"rfc3164"`

syslog message format: you can choose between rfc3164 or rfc5424

### `severity` [v3.1.0-plugins-outputs-syslog-severity]

* Value type is [string](/lsr/value-types.md#string)
* Default value is `"notice"`

severity label for syslog message default fallback to notice as in rfc3164 The new value can include `%{foo}` strings to help you build a new value from other parts of the event.

### `sourcehost` [v3.1.0-plugins-outputs-syslog-sourcehost]

* Value type is [string](/lsr/value-types.md#string)
* Default value is `"%{host}"`

source host for syslog message. The new value can include `%{foo}` strings to help you build a new value from other parts of the event.

### `ssl_certificate` [v3.1.0-plugins-outputs-syslog-ssl_certificate]

* Value type is [path](/lsr/value-types.md#path)
* There is no default value for this setting.

SSL certificate path

### `ssl_certificate_authorities` [v3.1.0-plugins-outputs-syslog-ssl_certificate_authorities]

* Value type is a list of [path](/lsr/value-types.md#path)
* There is no default value for this setting

List of SSL CA certificate, chainfile or CA path. The system CA path is automatically included.

### `ssl_key` [v3.1.0-plugins-outputs-syslog-ssl_key]

* Value type is [path](/lsr/value-types.md#path)
* There is no default value for this setting.

SSL key path

### `ssl_key_passphrase` [v3.1.0-plugins-outputs-syslog-ssl_key_passphrase]

* Value type is [password](/lsr/value-types.md#password)
* Default value is `nil`

SSL key passphrase

### `ssl_verify` [v3.1.0-plugins-outputs-syslog-ssl_verify]

* Value type is [boolean](/lsr/value-types.md#boolean)
* Default value is `false`

Verify the identity of the other end of the SSL connection against the CA.

### `ssl_crl_path` [v3.1.0-plugins-outputs-syslog-ssl_crl_path]

* Value type is [path](/lsr/value-types.md#path)
* There is no default value for this setting.

SSL CRL path for checking the revocation status of the server certificate. File may contain one or more PEM encoded CRLs.

### `ssl_crl_check` [v3.1.0-plugins-outputs-syslog-ssl_crl_check]

* Value type is [array](/lsr/value-types.md#array)
* Default value is `['leaf']`

When set to `leaf` (default), only the server certificate is validated against CRLs. When set to `chain`, the entire certificate chain, including subordinate Certificate Authorities, is validated against CRLs. For each certificate validated, a CRL from its issuing Certificate Authority must be present in the [`ssl_crl_path`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-ssl_crl_path).

### `ssl_cipher_suites` [v3.1.0-plugins-outputs-syslog-ssl_cipher_suites]

* Value type is [array](/lsr/value-types.md#array)
* There is no default value for this setting

The list of cipher suites to use, listed by priorities. Supported cipher suites vary depending on the Java and protocol versions.

### `ssl_supported_protocols` [v3.1.0-plugins-outputs-syslog-ssl_supported_protocols]

* Value type is [array](/lsr/value-types.md#array)
* Allowed values are: `'TLSv1.1'`, `'TLSv1.2'`, `'TLSv1.3'`
* Default depends on the JDK being used. With up-to-date Logstash, the default is `['TLSv1.2', 'TLSv1.3']`. `'TLSv1.1'` is not considered secure and is only provided for legacy applications.

List of allowed SSL/TLS versions to use when establishing a connection to the HTTP endpoint.

For Java 8 `'TLSv1.3'` is supported only since **8u262** (Adoptium.net), but requires that you set the `LS_JAVA_OPTS="-Djdk.tls.client.protocols=TLSv1.3"` system property in Logstash.

If you configure the plugin to use `'TLSv1.1'` on any recent JVM, such as the one packaged with Logstash, the protocol is disabled by default and needs to be enabled manually by changing `jdk.tls.disabledAlgorithms` in the **$JDK_HOME/conf/security/java.security** configuration file. That is, `TLSv1.1` needs to be removed from the list.

### `use_labels` [v3.1.0-plugins-outputs-syslog-use_labels]

* Value type is [boolean](/lsr/value-types.md#boolean)
* Default value is `true`

use label parsing for severity and facility levels use priority field if set to false

### `structured_data` [v3.1.0-plugins-outputs-syslog-structured_data]

* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

RFC5424 structured data is a string of one or more structured data elements, including brackets. The elements need to be formatted according to [RFC5424 section 6.3](https://datatracker.ietf.org/doc/html/rfc5424#section-6.3), for example:

```
  `[exampleSDID@32473 iut="3" eventSource="Application" eventID="1011"][examplePriority@32473 class="high"]`
```

The new value can include `%{foo}` strings to help you build a new value from other parts of the event.

## Deprecated Configuration Options [v3.1.0-plugins-outputs-syslog-deprecated-options]

Deprecated options are subject to removal in future releases.

| Setting | Input type | Replaced by |
| :- | :- | :- |
| [`ssl_cacert`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-ssl_cacert) | a valid filesystem path | [`ssl_certificate_authorities`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-ssl_certificate_authorities) |
| [`ssl_cert`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-ssl_cert) | a valid filesystem path | [`ssl_certificate`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-ssl_certificate) |

### `ssl_cacert` [v3.1.0-plugins-outputs-syslog-ssl_cacert]

Deprecated in 3.1.0 Replaced by [`ssl_certificate_authorities`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-ssl_certificate_authorities).

* Value type is [path](/lsr/value-types.md#path)
* There is no default value for this setting.

The SSL CA certificate, chainfile or CA path. The system CA path is automatically included.

### `ssl_cert` [v3.1.0-plugins-outputs-syslog-ssl_cert]

Deprecated in 3.1.0 Replaced by [`ssl_certificate`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-ssl_certificate).

* Value type is [path](/lsr/value-types.md#path)
* There is no default value for this setting.

SSL certificate path

## Common options [v3.1.0-plugins-outputs-syslog-common-options]

These configuration options are supported by all output plugins:

| Setting | Input type | Required |
| :- | :- | :- |
| [`codec`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-codec) | [codec](/lsr/value-types.md#codec) | No |
| [`enable_metric`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-enable_metric) | [boolean](/lsr/value-types.md#boolean) | No |
| [`id`](v3-1-0-plugins-outputs-syslog.md#v3.1.0-plugins-outputs-syslog-id) | [string](/lsr/value-types.md#string) | No |

### `codec` [v3.1.0-plugins-outputs-syslog-codec]

* Value type is [codec](/lsr/value-types.md#codec)
* Default value is `"plain"`

The codec used for output data. Output codecs are a convenient method for encoding your data before it leaves the output without needing a separate filter in your Logstash pipeline.

### `enable_metric` [v3.1.0-plugins-outputs-syslog-enable_metric]

* Value type is [boolean](/lsr/value-types.md#boolean)
* Default value is `true`

Disable or enable metric logging for this specific plugin instance. By default we record all the metrics we can, but you can disable metrics collection for a specific plugin.

### `id` [v3.1.0-plugins-outputs-syslog-id]

* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

Add a unique `ID` to the plugin configuration. If no ID is specified, Logstash will generate one. It is strongly recommended to set this ID in your configuration. This is particularly useful when you have two or more plugins of the same type. For example, if you have 2 syslog outputs. Adding a named ID in this case will help in monitoring Logstash when using the monitoring APIs.

```
output {
  syslog {
    id => "my_plugin_id"
  }
}
```
