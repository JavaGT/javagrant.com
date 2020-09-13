# sh icons.sh will create a smaller, compressed image of all files in /img in /icon with the same file name.
for f in ./img/*.jpg; do
  convert -define jpeg:extent=256kb -resize 300x ./"$f" ./icon"${f:5}"
done