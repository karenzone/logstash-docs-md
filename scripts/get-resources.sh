# Example: `scripts/get-resources.sh 9.1`

# Validate arguments
VERSION="$1"
if [[ ! "$1" ]]; then
  echo "⚠️  Missing a minor version"
  exit [1]
elif [[ ! "$1" =~ ^[0-9]+\.[0-9]+$ ]]; then
  echo "⚠️  Use a minor version format (for example, \`9.1\`)"
  exit [1]
else
  echo "Using minor version $1"
fi

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

# Get the Gemfile from the logstash repo
cd ../
mkdir -p "logstash/$1"
curl -L "https://raw.githubusercontent.com/elastic/logstash/$1/Gemfile.jruby-3.1.lock.release" > "logstash/$1/Gemfile.jruby-3.1.lock.release"
