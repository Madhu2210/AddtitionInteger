echo -n "Enter nth number: "
read num
t=1
total=0
while test $t -le $num
do
	total=$((total+t))
	t=$((t + 1))
done
echo "Sum of $num: " $total
