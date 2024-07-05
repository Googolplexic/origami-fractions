import math


def simplifyFraction(n, d):
    for i in range(n, 1, -1):
        if d % i == 0:
            n //= i
            d //= i
    return n, d


a = int(input("Enter numerator: "))
b = int(input("Enter denominator: "))

a, b = simplifyFraction(a, b)

p = 1
while p < a or p < b - a:
    p *= 2
mBin = ""
nBin = ""
if not (b == p):

    m = a
    n = p + a - b
    print(m)
    print(n)

    p_m = p_n = p
    p_n = 1 if n == 0 else p
    while m % 2 == 0 and m > 0:
        m //= 2
        p_m //= 2
    while n % 2 == 0 and n > 0:
        n //= 2
        p_n //= 2
# coleman sucks at coding and should retire from his coding career 
    print(p)
    print(p_m)
    print(p_n)
    mBin = f"{m:0{int(math.log2(p_m))}b}"
    nBin = f"{n:0{int(math.log2(p_n))}b}" if not (n == 0) else ""
    print(mBin)
    print(nBin)
    print(f'Folding mark {m}/{p_m}')
    for char in mBin[::-1]:
        print(
            f'Fold the left side {"down" if char == "1" else "up"} to most recent point'
        )
    if not(n == 0):
        print(f'Folding mark {n}/{p_n}')
    for char in nBin[::-1]:
        print(
            f'Fold the right side {"down" if char == "1" else "up"} to most recent point'
        )
else:
    print(p)
    mBin = f"{a:0{int(math.log2(p))}b}"
    print(mBin)
    print(f'Folding paper into {b} segments')
    for char in mBin[:: -1]:
        print(f'Fold a side {"down" if char == "1" else "up"} to most recent point')

