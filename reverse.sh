echo "Please enter a number: "
read num
rev=0
temp=0
while [ $num -gt 0 ]
do
	temp=$((num % 10))
	rev=$((rev * 10 + temp))
	num=$((num/10))
done
echo "Reverse is:" $rev
