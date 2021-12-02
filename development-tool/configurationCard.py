
import os
fd=open("card/index.json","w")

l=[]

fd.write("{")

for home,dirs,files in os.walk("./card"):
    for filename in files:
        if(filename=="index.json"):
            continue
        home=home.replace("\\","/")
        str="\""+filename.split('.')[0]+"\":\""+home+'/'+filename+"\""

        l.append(str)

len=len(l)
for i in range(len):
    fd.write(l[i])
    if(i!=len-1):
        fd.write(",")



fd.write("}")

fd.close()
