# Make a temporary directory
mkdir -p temp
cd temp

# Get files from teh built-docs repo:
# * If built-docs has already been cloned, update the contents.
# * If built-docs has not been cloned, clone it and do a sparse checkout
#   to get just the files in the `raw/en/logstash/current` and
#   `raw/en/logstash-versioned-plugins/current` directories.
if [ -d "built-docs" ]; then
  echo "\`built-docs\` already exists"
else
  git clone --filter=blob:none --no-checkout git@github.com:elastic/built-docs.git
fi
cd built-docs
git sparse-checkout set --cone
git checkout master
git pull origin master
git sparse-checkout set raw/en/logstash/current raw/en/logstash-versioned-plugins/current

# Get the files from the logstash-docs repo
cd ../
if [ -d "logstash-docs" ]; then
  echo "\`logstash-docs\` already exists"
else
  git clone --filter=blob:none --no-checkout git@github.com:elastic/logstash-docs.git
fi
cd logstash-docs
git sparse-checkout set --cone
git checkout main
git sparse-checkout set docs/plugins
