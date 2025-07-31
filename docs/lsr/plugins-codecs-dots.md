---
navigation_title: dots
mapped_pages:
  - https://www.elastic.co/guide/en/logstash/current/plugins-codecs-dots.html

---

# Dots codec plugin

* Plugin version: v3.0.6 ([Other versions](/vpr/codec-dots-index.md))
* Released on: 2017-11-07
* [Changelog](https://github.com/logstash-plugins/logstash-codec-dots/blob/v3.0.6/CHANGELOG.md)





## Getting help [_getting_help]

For questions about the plugin, open a topic in the [Discuss](http://discuss.elastic.co) forums. For bugs or feature requests, open an issue in [Github](https://github.com/logstash-plugins/logstash-codec-dots). For the list of Elastic supported plugins, please consult the [Elastic Support Matrix](https://www.elastic.co/support/matrix#matrix_logstash_plugins).

## Description [_description]

This codec generates a dot(`.`) to represent each Event it processes. This is typically used with `stdout` output to provide feedback on the terminal. It is also used to measure Logstash’s throughtput with the `pv` command.
