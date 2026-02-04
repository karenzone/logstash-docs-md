---
navigation_title: v3.5.0
mapped_pages:
  - https://www.elastic.co/guide/en/logstash-versioned-plugins/current/v3.5.0-plugins-codecs-avro.html
applies_to:
  stack: ga
---

# Avro codec plugin v3.5.0 [v3.5.0-plugins-codecs-avro]

* Plugin version: v3.5.0
* Released on: 2025-11-26
* [Changelog](https://github.com/logstash-plugins/logstash-codec-avro/blob/v3.5.0/CHANGELOG.md)

For other versions, see the [overview list](codec-avro-index.md).

To learn more about Logstash, see the [Logstash Reference](https://www.elastic.co/guide/en/logstash/current/index.html).

## Getting help [_getting_help]

For questions about the plugin, open a topic in the [Discuss](http://discuss.elastic.co) forums. For bugs or feature requests, open an issue in [Github](https://github.com/logstash-plugins/logstash-codec-avro). For the list of Elastic supported plugins, please consult the [Elastic Support Matrix](https://www.elastic.co/support/matrix#matrix_logstash_plugins).

## Description [_description]

Read serialized Avro records as Logstash events

This plugin is used to serialize Logstash events as Avro datums, as well as deserializing Avro datums into Logstash events.

## Event Metadata and the Elastic Common Schema (ECS) [v3.5.0-plugins-codecs-avro-ecs_metadata]

The plugin behaves the same regardless of ECS compatibility, except adding the original message to `[event][original]`.

## Encoding [_encoding]

This codec is for serializing individual Logstash events as Avro datums that are Avro binary blobs. It does not encode Logstash events into an Avro file.

## Decoding [_decoding]

This codec is for deserializing individual Avro records. It is not for reading Avro files. Avro files have a unique format that must be handled upon input.

Partial deserialization

Avro format is known to support partial deserialization of arbitrary fields, providing a schema containing a subset of the schema which was used to serialize the data. This codec **doesn’t support partial deserialization of arbitrary fields**. Partial deserialization *might* work only when providing a schema which contains the first `N` fields of the schema used to serialize the data (and in the same order).

## Usage [_usage]

Example usage with Kafka input.

```
input {
  kafka {
    codec => avro {
        schema_uri => "/tmp/schema.avsc"
    }
  }
}
filter {
  ...
}
output {
  ...
}
```

## Avro Codec Configuration Options [v3.5.0-plugins-codecs-avro-options]

| Setting | Input type | Required |
| :- | :- | :- |
| [`ecs_compatibility`](v3-5-0-plugins-codecs-avro.md#v3.5.0-plugins-codecs-avro-ecs_compatibility) | [string](/lsr/value-types.md#string) | No |
| [`encoding`](v3-5-0-plugins-codecs-avro.md#v3.5.0-plugins-codecs-avro-encoding) | [string](/lsr/value-types.md#string), one of `["binary", "base64"]` | No |
| [`password`](v3-5-0-plugins-codecs-avro.md#v3.5.0-plugins-codecs-avro-password) | [password](/lsr/value-types.md#password) | No |
| [`proxy`](v3-5-0-plugins-codecs-avro.md#v3.5.0-plugins-codecs-avro-proxy) | [uri](/lsr/value-types.md#uri) | No |
| [`schema_uri`](v3-5-0-plugins-codecs-avro.md#v3.5.0-plugins-codecs-avro-schema_uri) | [string](/lsr/value-types.md#string) | Yes |
| [`ssl_certificate`](v3-5-0-plugins-codecs-avro.md#v3.5.0-plugins-codecs-avro-ssl_certificate) | [path](/lsr/value-types.md#path) | No |
| [`ssl_certificate_authorities`](v3-5-0-plugins-codecs-avro.md#v3.5.0-plugins-codecs-avro-ssl_certificate_authorities) | list of [path](/lsr/value-types.md#path) | No |
| [`ssl_cipher_suites`](v3-5-0-plugins-codecs-avro.md#v3.5.0-plugins-codecs-avro-ssl_cipher_suites) | [array](/lsr/value-types.md#array) | No |
| [`ssl_enabled`](v3-5-0-plugins-codecs-avro.md#v3.5.0-plugins-codecs-avro-ssl_enabled) | [boolean](/lsr/value-types.md#boolean) | No |
| [`ssl_key`](v3-5-0-plugins-codecs-avro.md#v3.5.0-plugins-codecs-avro-ssl_key) | [path](/lsr/value-types.md#path) | No |
| [`ssl_keystore_password`](v3-5-0-plugins-codecs-avro.md#v3.5.0-plugins-codecs-avro-ssl_keystore_password) | [password](/lsr/value-types.md#password) | No |
| [`ssl_keystore_path`](v3-5-0-plugins-codecs-avro.md#v3.5.0-plugins-codecs-avro-ssl_keystore_path) | [path](/lsr/value-types.md#path) | No |
| [`ssl_keystore_type`](v3-5-0-plugins-codecs-avro.md#v3.5.0-plugins-codecs-avro-ssl_keystore_type) | [string](/lsr/value-types.md#string) | No |
| [`ssl_supported_protocols`](v3-5-0-plugins-codecs-avro.md#v3.5.0-plugins-codecs-avro-ssl_supported_protocols) | [array](/lsr/value-types.md#array) | No |
| [`ssl_truststore_password`](v3-5-0-plugins-codecs-avro.md#v3.5.0-plugins-codecs-avro-ssl_truststore_password) | [password](/lsr/value-types.md#password) | No |
| [`ssl_truststore_path`](v3-5-0-plugins-codecs-avro.md#v3.5.0-plugins-codecs-avro-ssl_truststore_path) | [path](/lsr/value-types.md#path) | No |
| [`ssl_truststore_type`](v3-5-0-plugins-codecs-avro.md#v3.5.0-plugins-codecs-avro-ssl_truststore_type) | [string](/lsr/value-types.md#string) | No |
| [`ssl_verification_mode`](v3-5-0-plugins-codecs-avro.md#v3.5.0-plugins-codecs-avro-ssl_verification_mode) | [string](/lsr/value-types.md#string) | No |
| [`tag_on_failure`](v3-5-0-plugins-codecs-avro.md#v3.5.0-plugins-codecs-avro-tag_on_failure) | [boolean](/lsr/value-types.md#boolean) | No |
| [`target`](v3-5-0-plugins-codecs-avro.md#v3.5.0-plugins-codecs-avro-target) | [string](/lsr/value-types.md#string) | No |
| [`username`](v3-5-0-plugins-codecs-avro.md#v3.5.0-plugins-codecs-avro-username) | [string](/lsr/value-types.md#string) | No |

### `ecs_compatibility` [v3.5.0-plugins-codecs-avro-ecs_compatibility]

* Value type is [string](/lsr/value-types.md#string)

* Supported values are:

  * `disabled`: Avro data added at root level
  * `v1`,`v8`: Elastic Common Schema compliant behavior (`[event][original]` is also added)

Controls this plugin’s compatibility with the [Elastic Common Schema (ECS)](https://www.elastic.co/guide/en/ecs/current).

### `encoding` [v3.5.0-plugins-codecs-avro-encoding]

* Value can be any of: `binary`, `base64`
* Default value is `base64`

Set encoding for Avro’s payload. Use `base64` (default) to indicate that this codec sends or expects to receive base64-encoded bytes.

Set this option to `binary` to indicate that this codec sends or expects to receive binary Avro data.

### `password` [v3.5.0-plugins-codecs-avro-password]

* Value type is [password](/lsr/value-types.md#password)
* There is no default value for this setting.

Password for HTTP basic authentication when fetching remote schemas. Used together with `username`.

### `proxy` [v3.5.0-plugins-codecs-avro-proxy]

* Value type is [uri](/lsr/value-types.md#uri)
* There is no default value for this setting.

The address of a forward HTTP proxy to use when contacting a remote schema registry.

### `schema_uri` [v3.5.0-plugins-codecs-avro-schema_uri]

* This is a required setting.
* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

schema path to fetch the schema from. This can be a *http* or *file* scheme URI example:

* http - `http://example.com/schema.avsc`
* file - `/path/to/schema.avsc`

### `tag_on_failure` [v3.5.0-plugins-codecs-avro-tag_on_failure]

* Value type is [boolean](/lsr/value-types.md#boolean)
* Default value is `false`

tag events with `_avroparsefailure` when decode fails

### `ssl_certificate` [v3.5.0-plugins-codecs-avro-ssl_certificate]

* Value type is [path](/lsr/value-types.md#path)
* There is no default value for this setting.

Path to PEM encoded certificate file for client authentication (mutual TLS). You may use this setting or [`ssl_keystore_path`](v3-5-0-plugins-codecs-avro.md#v3.5.0-plugins-codecs-avro-ssl_keystore_path), but not both simultaneously.

**Example**

```
ssl_certificate => "/path/to/client.crt"
```

### `ssl_certificate_authorities` [v3.5.0-plugins-codecs-avro-ssl_certificate_authorities]

* Value type is a list of [path](/lsr/value-types.md#path)
* There is no default value for this setting.

Path to PEM encoded CA certificate file(s) for server verification. This is an alternative to using [`ssl_truststore_path`](v3-5-0-plugins-codecs-avro.md#v3.5.0-plugins-codecs-avro-ssl_truststore_path). You may use this setting or [`ssl_truststore_path`](v3-5-0-plugins-codecs-avro.md#v3.5.0-plugins-codecs-avro-ssl_truststore_path), but not both simultaneously.

**Example**

```
ssl_certificate_authorities => ["/path/to/ca.crt"]
```

### `ssl_cipher_suites` [v3.5.0-plugins-codecs-avro-ssl_cipher_suites]

* Value type is [array](/lsr/value-types.md#array)
* There is no default value for this setting.

The list of cipher suites to use, listed by priorities. Supported cipher suites vary depending on which version of Java is used.

### `ssl_key` [v3.5.0-plugins-codecs-avro-ssl_key]

* Value type is [path](/lsr/value-types.md#path)
* There is no default value for this setting.

Path to PEM encoded private key file for client authentication. Must be used together with [`ssl_certificate`](v3-5-0-plugins-codecs-avro.md#v3.5.0-plugins-codecs-avro-ssl_certificate). The private key must be unencrypted (passphrase-protected keys are not supported).

**Example**

```
ssl_key => "/path/to/client.key"
```

### `ssl_enabled` [v3.5.0-plugins-codecs-avro-ssl_enabled]

* Value type is [boolean](/lsr/value-types.md#boolean)
* There is no default value for this setting.

Enable SSL/TLS secured communication to remote schema registry. When using HTTPS schema URIs, SSL is automatically enabled.

### `ssl_keystore_path` [v3.5.0-plugins-codecs-avro-ssl_keystore_path]

* Value type is [path](/lsr/value-types.md#path)
* There is no default value for this setting.

The path to the JKS or PKCS12 keystore file for client certificate authentication. Use this when the schema registry requires mutual TLS (mTLS) authentication.

### `ssl_keystore_password` [v3.5.0-plugins-codecs-avro-ssl_keystore_password]

* Value type is [password](/lsr/value-types.md#password)
* There is no default value for this setting.

The password for the keystore file specified in [`ssl_keystore_path`](v3-5-0-plugins-codecs-avro.md#v3.5.0-plugins-codecs-avro-ssl_keystore_path).

### `ssl_keystore_type` [v3.5.0-plugins-codecs-avro-ssl_keystore_type]

* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

The format of the keystore file. It must be either `jks` or `pkcs12`.

### `ssl_supported_protocols` [v3.5.0-plugins-codecs-avro-ssl_supported_protocols]

* Value type is [array](/lsr/value-types.md#array)
* Default value is `[]` (uses Java defaults)
* Valid values are: `TLSv1.1`, `TLSv1.2`, `TLSv1.3`

List of allowed SSL/TLS protocol versions. When not specified, the JVM defaults are used.

### `ssl_truststore_path` [v3.5.0-plugins-codecs-avro-ssl_truststore_path]

* Value type is [path](/lsr/value-types.md#path)
* There is no default value for this setting.

The path to the JKS or PKCS12 truststore file containing certificates to verify the schema registry server’s certificate.

**Example**

```
input {
  kafka {
    codec => avro {
        schema_uri => "https://schema-registry.example.com:8081/schemas/ids/1"
        ssl_truststore_path => "/path/to/truststore.jks"
        ssl_truststore_password => "${TRUSTSTORE_PASSWORD}"
    }
  }
}
```

### `ssl_truststore_password` [v3.5.0-plugins-codecs-avro-ssl_truststore_password]

* Value type is [password](/lsr/value-types.md#password)
* There is no default value for this setting.

The password for the truststore file specified in [`ssl_truststore_path`](v3-5-0-plugins-codecs-avro.md#v3.5.0-plugins-codecs-avro-ssl_truststore_path).

### `ssl_truststore_type` [v3.5.0-plugins-codecs-avro-ssl_truststore_type]

* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

The format of the truststore file. It must be either `jks` or `pkcs12`.

### `ssl_verification_mode` [v3.5.0-plugins-codecs-avro-ssl_verification_mode]

* Value type is [string](/lsr/value-types.md#string)
* Default value is `"full"`
* Valid options are: `full`, `none`

Options to verify the server’s certificate:

* `full`: Validates that the provided certificate has an issue date that’s within the not_before and not_after dates; chains to a trusted Certificate Authority (CA); has a hostname or IP address that matches the names within the certificate. (recommended)
* `none`: Performs no certificate validation. **Warning:** Disabling this severely compromises security (<https://www.cs.utexas.edu/~shmat/shmat_ccs12.pdf>)

**Example**

```
input {
  kafka {
    codec => avro {
        schema_uri => "https://schema-registry.example.com:8081/schemas/ids/1"
        ssl_certificate_authorities => ["/path/to/ca.crt"]
        ssl_verification_mode => "full"
    }
  }
}
```

### `target` [v3.5.0-plugins-codecs-avro-target]

* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.
* This is only relevant when decode data into an event

Define the target field for placing the values. If this setting is not set, the Avro data will be stored at the root (top level) of the event.

**Example**

```
input {
  kafka {
    codec => avro {
        schema_uri => "/tmp/schema.avsc"
        target => "[document]"
    }
  }
}
```

### `username` [v3.5.0-plugins-codecs-avro-username]

* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

Username for HTTP basic authentication when fetching remote schemas. Used together with `password`.

**Example**

```
input {
  kafka {
    codec => avro {
        schema_uri => "https://schema-registry.example.com:8081/schemas/ids/1"
        username => "registry_user"
        password => "${REGISTRY_PASSWORD}"
    }
  }
}
```
