---
navigation_title: v4.3.1
mapped_pages:
  - https://www.elastic.co/guide/en/logstash-versioned-plugins/current/v4.3.1-plugins-filters-elasticsearch.html
applies_to:
  stack: ga
---

# Elasticsearch filter plugin v4.3.1 [v4.3.1-plugins-filters-elasticsearch]

* Plugin version: v4.3.1
* Released on: 2025-09-23
* [Changelog](https://github.com/logstash-plugins/logstash-filter-elasticsearch/blob/v4.3.1/CHANGELOG.md)

For other versions, see the [overview list](filter-elasticsearch-index.md).

To learn more about Logstash, see the [Logstash Reference](https://www.elastic.co/guide/en/logstash/current/index.html).

## Getting help [_getting_help]

For questions about the plugin, open a topic in the [Discuss](http://discuss.elastic.co) forums. For bugs or feature requests, open an issue in [Github](https://github.com/logstash-plugins/logstash-filter-elasticsearch). For the list of Elastic supported plugins, please consult the [Elastic Support Matrix](https://www.elastic.co/support/matrix#matrix_logstash_plugins).

## Description [_description]

Search Elasticsearch for a previous log event and copy some fields from it into the current event. Below are two complete examples of how this filter might be used.

The first example uses the legacy *query* parameter where the user is limited to an Elasticsearch query_string. Whenever logstash receives an "end" event, it uses this elasticsearch filter to find the matching "start" event based on some operation identifier. Then it copies the `@timestamp` field from the "start" event into a new field on the "end" event. Finally, using a combination of the "date" filter and the "ruby" filter, we calculate the time duration in hours between the two events.

```
if [type] == "end" {
   elasticsearch {
      hosts => ["es-server"]
      query => "type:start AND operation:%{[opid]}"
      fields => { "@timestamp" => "started" }
   }

   date {
      match => ["[started]", "ISO8601"]
      target => "[started]"
   }

   ruby {
      code => "event.set('duration_hrs', (event.get('@timestamp') - event.get('started')) / 3600)"
   }
}
```

The example below reproduces the above example but utilises the query_template. This query_template represents a full Elasticsearch query DSL and supports the standard Logstash field substitution syntax. The example below issues the same query as the first example but uses the template shown.

```
if [type] == "end" {
      elasticsearch {
         hosts => ["es-server"]
         query_template => "template.json"
         fields => { "@timestamp" => "started" }
      }

      date {
         match => ["[started]", "ISO8601"]
         target => "[started]"
      }

      ruby {
         code => "event.set('duration_hrs', (event.get('@timestamp') - event.get('started')) / 3600)"
      }
}
```

template.json:

```
{
  "size": 1,
  "sort" : [ { "@timestamp" : "desc" } ],
  "query": {
    "query_string": {
      "query": "type:start AND operation:%{[opid]}"
    }
  },
  "_source": ["@timestamp"]
}
```

As illustrated above, through the use of *opid*, fields from the Logstash events can be referenced within the template. The template will be populated per event prior to being used to query Elasticsearch.

Notice also that when you use `query_template`, the Logstash attributes `result_size` and `sort` will be ignored. They should be specified directly in the JSON template, as shown in the example above.

## Authentication [v4.3.1-plugins-filters-elasticsearch-auth]

Authentication to a secure Elasticsearch cluster is possible using *one* of the following options:

* [`user`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-user) AND [`password`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-password)
* [`cloud_auth`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-cloud_auth)
* [`api_key`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-api_key)
* [`ssl_keystore_path`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-ssl_keystore_path) and/or [`ssl_keystore_password`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-ssl_keystore_password)

## Authorization [v4.3.1-plugins-filters-elasticsearch-autz]

Authorization to a secure Elasticsearch cluster requires `read` permission at index level and `monitoring` permissions at cluster level. The `monitoring` permission at cluster level is necessary to perform periodic connectivity checks.

## ES|QL support [v4.3.1-plugins-filters-elasticsearch-esql]

**Technical Preview**

The ES|QL feature that allows using ES|QL queries with this plugin is in Technical Preview. Configuration options and implementation details are subject to change in minor releases without being preceded by deprecation warnings.

Elasticsearch Query Language (ES|QL) provides a SQL-like interface for querying your Elasticsearch data.

To use ES|QL, this plugin needs to be installed in Logstash 8.17.4 or newer, and must be connected to Elasticsearch 8.11 or newer.

To configure ES|QL query in the plugin, set your ES|QL query in the `query` parameter.

We recommend understanding [ES|QL current limitations](https://www.elastic.co/guide/en/elasticsearch/reference/current/esql-limitations.html) before using it in production environments.

The following is a basic ES|QL query that sets the food name to transaction event based on upstream event’s food ID:

```
    filter {
      elasticsearch {
        hosts => [ 'https://..']
        api_key => '....'
        query => '
          FROM food-index
            | WHERE id == ?food_id
        '
        query_params => {
          "food_id" => "[food][id]"
        }
      }
    }
```

Set `config.support_escapes: true` in `logstash.yml` if you need to escape special chars in the query.

In the result event, the plugin sets total result size in `[@metadata][total_values]` field.

### Mapping ES|QL result to Logstash event [v4.3.1-plugins-filters-elasticsearch-esql-event-mapping]

ES|QL returns query results in a structured tabular format, where data is organized into *columns* (fields) and *values* (entries). The plugin maps each value entry to an event, populating corresponding fields. For example, a query might produce a table like:

| `timestamp` | `user_id` | `action` | `status.code` | `status.desc` |
| :- | :- | :- | :- | :- |
| 2025-04-10T12:00:00 | 123 | login | 200 | Success |
| 2025-04-10T12:05:00 | 456 | purchase | 403 | Forbidden (unauthorized user) |

For this case, the plugin creates two JSON look like objects as below and places them into the `target` field of the event if `target` is defined. If `target` is not defined, the plugin places the *only* first result at the root of the event.

```
[
  {
    "timestamp": "2025-04-10T12:00:00",
    "user_id": 123,
    "action": "login",
    "status": {
        "code": 200,
        "desc": "Success"
    }
  },
  {
    "timestamp": "2025-04-10T12:05:00",
    "user_id": 456,
    "action": "purchase",
    "status": {
        "code": 403,
        "desc": "Forbidden (unauthorized user)"
    }
  }
]
```

If your index has a mapping with sub-objects where `status.code` and `status.desc` actually dotted fields, they appear in Logstash events as a nested structure.

### Conflict on multi-fields [v4.3.1-plugins-filters-elasticsearch-esql-multifields]

ES|QL query fetches all parent and sub-fields fields if your Elasticsearch index has [multi-fields](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/multi-fields) or [subobjects](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/subobjects). Since Logstash events cannot contain parent field’s concrete value and sub-field values together, the plugin ignores sub-fields with warning and includes parent. We recommend using the `RENAME` (or `DROP` to avoid warning) keyword in your ES|QL query explicitly rename the fields to include sub-fields into the event.

This is a common occurrence if your template or mapping follows the pattern of always indexing strings as "text" (`field`) + " keyword" (`field.keyword`) multi-field. In this case it’s recommended to do `KEEP field` if the string is identical and there is only one subfield as the engine will optimize and retrieve the keyword, otherwise you can do `KEEP field.keyword | RENAME field.keyword as field`.

To illustrate the situation with example, assuming your mapping has a time `time` field with `time.min` and `time.max` sub-fields as following:

```
    "properties": {
        "time": { "type": "long" },
        "time.min": { "type": "long" },
        "time.max": { "type": "long" }
    }
```

The ES|QL result will contain all three fields but the plugin cannot map them into Logstash event. To avoid this, you can use the `RENAME` keyword to rename the `time` parent field to get all three fields with unique fields.

```
    ...
    query => 'FROM my-index | RENAME time AS time.current'
    ...
```

For comprehensive ES|QL syntax reference and best practices, see the [ES|QL documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/esql-syntax.html).

## Elasticsearch Filter Configuration Options [v4.3.1-plugins-filters-elasticsearch-options]

This plugin supports the following configuration options plus the [Common options](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-common-options) described later.

As of version `4.0.0` of this plugin, a number of previously deprecated settings related to SSL have been removed. Please see the [Elasticsearch Filter Obsolete Configuration Options](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-obsolete-options) for more details.

| Setting | Input type | Required |
| :- | :- | :- |
| [`aggregation_fields`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-aggregation_fields) | [hash](/lsr/value-types.md#hash) | No |
| [`api_key`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-api_key) | [password](/lsr/value-types.md#password) | No |
| [`ca_trusted_fingerprint`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-ca_trusted_fingerprint) | [string](/lsr/value-types.md#string) | No |
| [`cloud_auth`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-cloud_auth) | [password](/lsr/value-types.md#password) | No |
| [`cloud_id`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-cloud_id) | [string](/lsr/value-types.md#string) | No |
| [`custom_headers`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-custom_headers) | [hash](/lsr/value-types.md#hash) | No |
| [`docinfo_fields`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-docinfo_fields) | [hash](/lsr/value-types.md#hash) | No |
| [`enable_sort`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-enable_sort) | [boolean](/lsr/value-types.md#boolean) | No |
| [`fields`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-fields) | [array](/lsr/value-types.md#array) | No |
| [`hosts`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-hosts) | [array](/lsr/value-types.md#array) | No |
| [`index`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-index) | [string](/lsr/value-types.md#string) | No |
| [`password`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-password) | [password](/lsr/value-types.md#password) | No |
| [`proxy`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-proxy) | [uri](/lsr/value-types.md#uri) | No |
| [`query`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-query) | [string](/lsr/value-types.md#string) | No |
| [`query_type`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-query_type) | [string](/lsr/value-types.md#string), one of `["dsl", "esql"]` | No |
| [`query_params`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-query_params) | [hash](/lsr/value-types.md#hash) or [hash](/lsr/value-types.md#hash) | No |
| [`query_template`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-query_template) | [string](/lsr/value-types.md#string) | No |
| [`result_size`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-result_size) | [number](/lsr/value-types.md#number) | No |
| [`retry_on_failure`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-retry_on_failure) | [number](/lsr/value-types.md#number) | No |
| [`retry_on_status`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-retry_on_status) | [array](/lsr/value-types.md#array) | No |
| [`sort`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-sort) | [string](/lsr/value-types.md#string) | No |
| [`ssl_certificate`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-ssl_certificate) | [path](/lsr/value-types.md#path) | No |
| [`ssl_certificate_authorities`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-ssl_certificate_authorities) | list of [path](/lsr/value-types.md#path) | No |
| [`ssl_cipher_suites`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-ssl_cipher_suites) | list of [string](/lsr/value-types.md#string) | No |
| [`ssl_enabled`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-ssl_enabled) | [boolean](/lsr/value-types.md#boolean) | No |
| [`ssl_key`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-ssl_key) | [path](/lsr/value-types.md#path) | No |
| [`ssl_keystore_password`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-ssl_keystore_password) | [password](/lsr/value-types.md#password) | No |
| [`ssl_keystore_path`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-ssl_keystore_path) | [path](/lsr/value-types.md#path) | No |
| [`ssl_keystore_type`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-ssl_keystore_type) | [string](/lsr/value-types.md#string) | No |
| [`ssl_supported_protocols`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-ssl_supported_protocols) | [string](/lsr/value-types.md#string) | No |
| [`ssl_truststore_password`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-ssl_truststore_password) | [password](/lsr/value-types.md#password) | No |
| [`ssl_truststore_path`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-ssl_truststore_path) | [path](/lsr/value-types.md#path) | No |
| [`ssl_truststore_type`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-ssl_truststore_type) | [string](/lsr/value-types.md#string) | No |
| [`ssl_verification_mode`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-ssl_verification_mode) | [string](/lsr/value-types.md#string), one of `["full", "none"]` | No |
| [`tag_on_failure`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-tag_on_failure) | [array](/lsr/value-types.md#array) | No |
| [`target`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-target) | [string](/lsr/value-types.md#string) | No |
| [`user`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-user) | [string](/lsr/value-types.md#string) | No |

Also see [Common options](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-common-options) for a list of options supported by all filter plugins.

### `aggregation_fields` [v4.3.1-plugins-filters-elasticsearch-aggregation_fields]

* Value type is [hash](/lsr/value-types.md#hash)

* Default value is `{}`

* Format: `"aggregation_name" => "[path][on][event]"`:

  * `aggregation_name`: aggregation name in result from Elasticsearch
  * `[path][on][event]`: path for where to place the value on the current event, using field-reference notation

A mapping of aggregations to copy into the [`target`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-target) of the current event.

Example:

```
    filter {
      elasticsearch {
        aggregation_fields => {
          "my_agg_name" => "my_ls_field"
        }
      }
    }
```

### `api_key` [v4.3.1-plugins-filters-elasticsearch-api_key]

* Value type is [password](/lsr/value-types.md#password)
* There is no default value for this setting.

Authenticate using Elasticsearch API key. Note that this option also requires enabling the [`ssl_enabled`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-ssl_enabled) option.

Format is `id:api_key` where `id` and `api_key` are as returned by the Elasticsearch [Create API key API](https://www.elastic.co/guide/en/elasticsearch/reference/current/security-api-create-api-key.html).

### `ca_trusted_fingerprint` [v4.3.1-plugins-filters-elasticsearch-ca_trusted_fingerprint]

* Value type is [string](/lsr/value-types.md#string), and must contain exactly 64 hexadecimal characters.
* There is no default value for this setting.
* Use of this option *requires* Logstash 8.3+

The SHA-256 fingerprint of an SSL Certificate Authority to trust, such as the autogenerated self-signed CA for an Elasticsearch cluster.

### `cloud_auth` [v4.3.1-plugins-filters-elasticsearch-cloud_auth]

* Value type is [password](/lsr/value-types.md#password)
* There is no default value for this setting.

Cloud authentication string ("\<username>:\<password>" format) is an alternative for the `user`/`password` pair.

For more info, check out the [Logstash-to-Cloud documentation](https://www.elastic.co/guide/en/logstash/current/connecting-to-cloud.html).

### `cloud_id` [v4.3.1-plugins-filters-elasticsearch-cloud_id]

* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

Cloud ID, from the Elastic Cloud web console. If set `hosts` should not be used.

For more info, check out the [Logstash-to-Cloud documentation](https://www.elastic.co/guide/en/logstash/current/connecting-to-cloud.html).

### `custom_headers` [v4.3.1-plugins-filters-elasticsearch-custom_headers]

* Value type is [hash](/lsr/value-types.md#hash)
* Default value is empty

Pass a set of key value pairs as the headers sent in each request to Elasticsearch. These custom headers will override any headers previously set by the plugin such as the User Agent or Authorization headers.

### `docinfo_fields` [v4.3.1-plugins-filters-elasticsearch-docinfo_fields]

* Value type is [hash](/lsr/value-types.md#hash)

* Default value is `{}`

* Format: `"path.in.source" => "[path][on][event]"`:

  * `path.in.source`: field path in document source of result from Elasticsearch, using dot-notation
  * `[path][on][event]`: path for where to place the value on the current event, using field-reference notation

A mapping of docinfo (`_source`) fields to copy into the [`target`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-target) of the current event.

Example:

```
    filter {
      elasticsearch {
        docinfo_fields => {
          "_id" => "document_id"
          "_index" => "document_index"
        }
      }
    }
```

### `enable_sort` [v4.3.1-plugins-filters-elasticsearch-enable_sort]

* Value type is [boolean](/lsr/value-types.md#boolean)
* Default value is `true`

Whether results should be sorted or not

### `fields` [v4.3.1-plugins-filters-elasticsearch-fields]

* Value type is [array](/lsr/value-types.md#array)

* Default value is `{}`

* Format: `"path.in.result" => "[path][on][event]"`:

  * `path.in.result`: field path in indexed result from Elasticsearch, using dot-notation
  * `[path][on][event]`: path for where to place the value on the current event, using field-reference notation

A mapping of indexed fields to copy into the [`target`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-target) of the current event.

In the following example, the values of `@timestamp` and `event_id` on the event found via elasticsearch are copied to the current event’s `started` and `start_id` fields, respectively:

```
fields => {
  "@timestamp" => "started"
  "event_id" => "start_id"
}
```

### `hosts` [v4.3.1-plugins-filters-elasticsearch-hosts]

* Value type is [array](/lsr/value-types.md#array)
* Default value is `["localhost:9200"]`

List of elasticsearch hosts to use for querying.

### `index` [v4.3.1-plugins-filters-elasticsearch-index]

* Value type is [string](/lsr/value-types.md#string)
* Default value is `""`

Comma-delimited list of index names to search; use `_all` or empty string to perform the operation on all indices. Field substitution (e.g. `index-name-%{date_field}`) is available

### `password` [v4.3.1-plugins-filters-elasticsearch-password]

* Value type is [password](/lsr/value-types.md#password)
* There is no default value for this setting.

Basic Auth - password

### `proxy` [v4.3.1-plugins-filters-elasticsearch-proxy]

* Value type is [uri](/lsr/value-types.md#uri)
* There is no default value for this setting.

Set the address of a forward HTTP proxy. An empty string is treated as if proxy was not set, and is useful when using environment variables e.g. `proxy => '${LS_PROXY:}'`.

### `query` [v4.3.1-plugins-filters-elasticsearch-query]

* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

The query to be executed. The accepted query shape is DSL query string or ES|QL. For the DSL query string, use either `query` or `query_template`. Read the [Elasticsearch query string documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html) or [Elasticsearch ES|QL documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/esql.html) for more information.

### `query_type` [v4.3.1-plugins-filters-elasticsearch-query_type]

* Value can be `dsl` or `esql`
* Default value is `dsl`

Defines the [`query`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-query) shape. When `dsl`, the query shape must be valid Elasticsearch JSON-style string. When `esql`, the query shape must be a valid ES|QL string and `index`, `query_template` and `sort` parameters are not allowed.

### `query_params` [v4.3.1-plugins-filters-elasticsearch-query_params]

* The value type is [hash](/lsr/value-types.md#hash) or [array](/lsr/value-types.md#array). When an array provided, the array elements are pairs of `key` and `value`.
* There is no default value for this setting

Named parameters in ES|QL to send to Elasticsearch together with [`query`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-query). Visit [passing parameters to query page](https://www.elastic.co/guide/en/elasticsearch/reference/current/esql-rest.html#esql-rest-params) for more information.

### `query_template` [v4.3.1-plugins-filters-elasticsearch-query_template]

* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

File path to elasticsearch query in DSL format. More information is available in the [Elasticsearch query documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html). Use either `query` or `query_template`.

### `result_size` [v4.3.1-plugins-filters-elasticsearch-result_size]

* Value type is [number](/lsr/value-types.md#number)
* Default value is `1`

How many results to return

### `retry_on_failure` [v4.3.1-plugins-filters-elasticsearch-retry_on_failure]

* Value type is [number](/lsr/value-types.md#number)
* Default value is `0` (retries disabled)

How many times to retry an individual failed request.

When enabled, retry requests that result in connection errors or an HTTP status code included in [`retry_on_status`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-retry_on_status)

### `retry_on_status` [v4.3.1-plugins-filters-elasticsearch-retry_on_status]

* Value type is [array](/lsr/value-types.md#array)
* Default value is an empty list `[]`

Which HTTP Status codes to consider for retries (in addition to connection errors) when using [`retry_on_failure`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-retry_on_failure),

### `sort` [v4.3.1-plugins-filters-elasticsearch-sort]

* Value type is [string](/lsr/value-types.md#string)
* Default value is `"@timestamp:desc"`

Comma-delimited list of `<field>:<direction>` pairs that define the sort order

### `ssl_certificate` [v4.3.1-plugins-filters-elasticsearch-ssl_certificate]

* Value type is [path](/lsr/value-types.md#path)
* There is no default value for this setting.

SSL certificate to use to authenticate the client. This certificate should be an OpenSSL-style X.509 certificate file.

This setting can be used only if [`ssl_key`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-ssl_key) is set.

### `ssl_certificate_authorities` [v4.3.1-plugins-filters-elasticsearch-ssl_certificate_authorities]

* Value type is a list of [path](/lsr/value-types.md#path)
* There is no default value for this setting

The .cer or .pem files to validate the server’s certificate.

You cannot use this setting and [`ssl_truststore_path`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-ssl_truststore_path) at the same time.

### `ssl_cipher_suites` [v4.3.1-plugins-filters-elasticsearch-ssl_cipher_suites]

* Value type is a list of [string](/lsr/value-types.md#string)
* There is no default value for this setting

The list of cipher suites to use, listed by priorities. Supported cipher suites vary depending on the Java and protocol versions.

### `ssl_enabled` [v4.3.1-plugins-filters-elasticsearch-ssl_enabled]

* Value type is [boolean](/lsr/value-types.md#boolean)
* There is no default value for this setting.

Enable SSL/TLS secured communication to Elasticsearch cluster. Leaving this unspecified will use whatever scheme is specified in the URLs listed in [`hosts`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-hosts) or extracted from the [`cloud_id`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-cloud_id). If no explicit protocol is specified plain HTTP will be used.

### `ssl_key` [v4.3.1-plugins-filters-elasticsearch-ssl_key]

* Value type is [path](/lsr/value-types.md#path)
* There is no default value for this setting.

OpenSSL-style RSA private key that corresponds to the [`ssl_certificate`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-ssl_certificate).

This setting can be used only if [`ssl_certificate`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-ssl_certificate) is set.

### `ssl_keystore_password` [v4.3.1-plugins-filters-elasticsearch-ssl_keystore_password]

* Value type is [password](/lsr/value-types.md#password)
* There is no default value for this setting.

Set the keystore password

### `ssl_keystore_path` [v4.3.1-plugins-filters-elasticsearch-ssl_keystore_path]

* Value type is [path](/lsr/value-types.md#path)
* There is no default value for this setting.

The keystore used to present a certificate to the server. It can be either `.jks` or `.p12`

You cannot use this setting and [`ssl_certificate`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-ssl_certificate) at the same time.

### `ssl_keystore_type` [v4.3.1-plugins-filters-elasticsearch-ssl_keystore_type]

* Value can be any of: `jks`, `pkcs12`
* If not provided, the value will be inferred from the keystore filename.

The format of the keystore file. It must be either `jks` or `pkcs12`.

### `ssl_supported_protocols` [v4.3.1-plugins-filters-elasticsearch-ssl_supported_protocols]

* Value type is [string](/lsr/value-types.md#string)
* Allowed values are: `'TLSv1.1'`, `'TLSv1.2'`, `'TLSv1.3'`
* Default depends on the JDK being used. With up-to-date Logstash, the default is `['TLSv1.2', 'TLSv1.3']`. `'TLSv1.1'` is not considered secure and is only provided for legacy applications.

List of allowed SSL/TLS versions to use when establishing a connection to the Elasticsearch cluster.

For Java 8 `'TLSv1.3'` is supported only since **8u262** (AdoptOpenJDK), but requires that you set the `LS_JAVA_OPTS="-Djdk.tls.client.protocols=TLSv1.3"` system property in Logstash.

If you configure the plugin to use `'TLSv1.1'` on any recent JVM, such as the one packaged with Logstash, the protocol is disabled by default and needs to be enabled manually by changing `jdk.tls.disabledAlgorithms` in the **$JDK_HOME/conf/security/java.security** configuration file. That is, `TLSv1.1` needs to be removed from the list.

### `ssl_truststore_password` [v4.3.1-plugins-filters-elasticsearch-ssl_truststore_password]

* Value type is [password](/lsr/value-types.md#password)
* There is no default value for this setting.

Set the truststore password

### `ssl_truststore_path` [v4.3.1-plugins-filters-elasticsearch-ssl_truststore_path]

* Value type is [path](/lsr/value-types.md#path)
* There is no default value for this setting.

The truststore to validate the server’s certificate. It can be either `.jks` or `.p12`.

You cannot use this setting and [`ssl_certificate_authorities`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-ssl_certificate_authorities) at the same time.

### `ssl_truststore_type` [v4.3.1-plugins-filters-elasticsearch-ssl_truststore_type]

* Value can be any of: `jks`, `pkcs12`
* If not provided, the value will be inferred from the truststore filename.

The format of the truststore file. It must be either `jks` or `pkcs12`.

### `ssl_verification_mode` [v4.3.1-plugins-filters-elasticsearch-ssl_verification_mode]

* Value can be any of: `full`, `none`
* Default value is `full`

Defines how to verify the certificates presented by another party in the TLS connection:

`full` validates that the server certificate has an issue date that’s within the not_before and not_after dates; chains to a trusted Certificate Authority (CA), and has a hostname or IP address that matches the names within the certificate.

`none` performs no certificate validation.

Setting certificate verification to `none` disables many security benefits of SSL/TLS, which is very dangerous. For more information on disabling certificate verification please read <https://www.cs.utexas.edu/~shmat/shmat_ccs12.pdf>

### `tag_on_failure` [v4.3.1-plugins-filters-elasticsearch-tag_on_failure]

* Value type is [array](/lsr/value-types.md#array)
* Default value is `["_elasticsearch_lookup_failure"]`

Tags the event on failure to look up previous log event information. This can be used in later analysis.

### `target` [v4.3.1-plugins-filters-elasticsearch-target]

* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

Define the target field for placing the result data. If this setting is omitted, the target will be the root (top level) of the event. It is highly recommended to set when using `query_type=>'esql'` to set all query results into the event.

When `query_type=>'dsl'`, the destination fields specified in [`fields`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-fields), [`aggregation_fields`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-aggregation_fields), and [`docinfo_fields`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-docinfo_fields) are relative to this target.

For example, if you want the data to be put in the `operation` field:

```
if [type] == "end" {
    filter {
      query => "type:start AND transaction:%{[transactionId]}"
      elasticsearch {
        target => "transaction"
        fields => {
          "@timestamp" => "started"
          "transaction_id" => "id"
        }
      }
    }
}
```

`fields` fields will be expanded into a data structure in the `target` field, overall shape looks like this:

```
    {
      "transaction" => {
        "started" => "2025-04-29T12:01:46.263Z"
        "id" => "1234567890"
      }
    }
```

when writing to a field that already exists on the event, the previous value will be overwritten.

### `user` [v4.3.1-plugins-filters-elasticsearch-user]

* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

Basic Auth - username

## Elasticsearch Filter Obsolete Configuration Options [v4.3.1-plugins-filters-elasticsearch-obsolete-options]

As of version `4.0.0` of this plugin, some configuration options have been replaced. The plugin will fail to start if it contains any of these obsolete options.

| Setting | Replaced by | ca_file |
| :- | :- | :- |
| [`ssl_certificate_authorities`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-ssl_certificate_authorities) | keystore | [`ssl_keystore_path`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-ssl_keystore_path) |
| keystore_password | [`ssl_keystore_password`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-ssl_keystore_password) | ssl |

## Common options [v4.3.1-plugins-filters-elasticsearch-common-options]

These configuration options are supported by all filter plugins:

| Setting | Input type | Required |
| :- | :- | :- |
| [`add_field`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-add_field) | [hash](/lsr/value-types.md#hash) | No |
| [`add_tag`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-add_tag) | [array](/lsr/value-types.md#array) | No |
| [`enable_metric`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-enable_metric) | [boolean](/lsr/value-types.md#boolean) | No |
| [`id`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-id) | [string](/lsr/value-types.md#string) | No |
| [`periodic_flush`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-periodic_flush) | [boolean](/lsr/value-types.md#boolean) | No |
| [`remove_field`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-remove_field) | [array](/lsr/value-types.md#array) | No |
| [`remove_tag`](v4-3-1-plugins-filters-elasticsearch.md#v4.3.1-plugins-filters-elasticsearch-remove_tag) | [array](/lsr/value-types.md#array) | No |

### `add_field` [v4.3.1-plugins-filters-elasticsearch-add_field]

* Value type is [hash](/lsr/value-types.md#hash)
* Default value is `{}`

If this filter is successful, add any arbitrary fields to this event. Field names can be dynamic and include parts of the event using the `%{field}`.

Example:

```
    filter {
      elasticsearch {
        add_field => { "foo_%{somefield}" => "Hello world, from %{host}" }
      }
    }
```

```
    # You can also add multiple fields at once:
    filter {
      elasticsearch {
        add_field => {
          "foo_%{somefield}" => "Hello world, from %{host}"
          "new_field" => "new_static_value"
        }
      }
    }
```

If the event has field `"somefield" == "hello"` this filter, on success, would add field `foo_hello` if it is present, with the value above and the `%{host}` piece replaced with that value from the event. The second example would also add a hardcoded field.

### `add_tag` [v4.3.1-plugins-filters-elasticsearch-add_tag]

* Value type is [array](/lsr/value-types.md#array)
* Default value is `[]`

If this filter is successful, add arbitrary tags to the event. Tags can be dynamic and include parts of the event using the `%{field}` syntax.

Example:

```
    filter {
      elasticsearch {
        add_tag => [ "foo_%{somefield}" ]
      }
    }
```

```
    # You can also add multiple tags at once:
    filter {
      elasticsearch {
        add_tag => [ "foo_%{somefield}", "taggedy_tag"]
      }
    }
```

If the event has field `"somefield" == "hello"` this filter, on success, would add a tag `foo_hello` (and the second example would of course add a `taggedy_tag` tag).

### `enable_metric` [v4.3.1-plugins-filters-elasticsearch-enable_metric]

* Value type is [boolean](/lsr/value-types.md#boolean)
* Default value is `true`

Disable or enable metric logging for this specific plugin instance by default we record all the metrics we can, but you can disable metrics collection for a specific plugin.

### `id` [v4.3.1-plugins-filters-elasticsearch-id]

* Value type is [string](/lsr/value-types.md#string)
* There is no default value for this setting.

Add a unique `ID` to the plugin configuration. If no ID is specified, Logstash will generate one. It is strongly recommended to set this ID in your configuration. This is particularly useful when you have two or more plugins of the same type, for example, if you have 2 elasticsearch filters. Adding a named ID in this case will help in monitoring Logstash when using the monitoring APIs.

```
    filter {
      elasticsearch {
        id => "ABC"
      }
    }
```

### `periodic_flush` [v4.3.1-plugins-filters-elasticsearch-periodic_flush]

* Value type is [boolean](/lsr/value-types.md#boolean)
* Default value is `false`

Call the filter flush method at regular interval. Optional.

### `remove_field` [v4.3.1-plugins-filters-elasticsearch-remove_field]

* Value type is [array](/lsr/value-types.md#array)
* Default value is `[]`

If this filter is successful, remove arbitrary fields from this event. Fields names can be dynamic and include parts of the event using the %{field} Example:

```
    filter {
      elasticsearch {
        remove_field => [ "foo_%{somefield}" ]
      }
    }
```

```
    # You can also remove multiple fields at once:
    filter {
      elasticsearch {
        remove_field => [ "foo_%{somefield}", "my_extraneous_field" ]
      }
    }
```

If the event has field `"somefield" == "hello"` this filter, on success, would remove the field with name `foo_hello` if it is present. The second example would remove an additional, non-dynamic field.

### `remove_tag` [v4.3.1-plugins-filters-elasticsearch-remove_tag]

* Value type is [array](/lsr/value-types.md#array)
* Default value is `[]`

If this filter is successful, remove arbitrary tags from the event. Tags can be dynamic and include parts of the event using the `%{field}` syntax.

Example:

```
    filter {
      elasticsearch {
        remove_tag => [ "foo_%{somefield}" ]
      }
    }
```

```
    # You can also remove multiple tags at once:
    filter {
      elasticsearch {
        remove_tag => [ "foo_%{somefield}", "sad_unwanted_tag"]
      }
    }
```

If the event has field `"somefield" == "hello"` this filter, on success, would remove the tag `foo_hello` if it is present. The second example would remove a sad, unwanted tag as well.
