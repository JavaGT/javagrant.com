# sh icons.sh will create a smaller, compressed image of all files in /img in /icon with the same file name.
# echo ./img/**/**/*.jpg
for f in ./pic/*.jpg; do
  mkdir -p "$(dirname "./img${f:5}")" && convert -define jpeg:extent=3Mb ./"$f" ./img"${f:5}"
done
for f in ./pic/**/*.jpg; do
  mkdir -p "$(dirname "./img${f:5}")" && convert -define jpeg:extent=3Mb ./"$f" ./img"${f:5}"
done
for f in ./pic/**/**/*.jpg; do
  mkdir -p "$(dirname "./img${f:5}")" && convert -define jpeg:extent=3Mb ./"$f" ./img"${f:5}"
done

for f in ./img/*.jpg; do
  mkdir -p "$(dirname "./icon${f:5}")" && convert -define jpeg:extent=256kb -resize 300x ./"$f" ./icon"${f:5}"
done
for f in ./img/**/*.jpg; do
  mkdir -p "$(dirname "./icon${f:5}")" && convert -define jpeg:extent=256kb -resize 300x ./"$f" ./icon"${f:5}"
done
for f in ./img/**/**/*.jpg; do
  mkdir -p "$(dirname "./icon${f:5}")" && convert -define jpeg:extent=256kb -resize 300x ./"$f" ./icon"${f:5}"
done