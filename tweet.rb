# Use s system command
testing = system( "echo 'from the system'" )

# if system command is working
if (testing == true)
	puts 'system is confirmed'
end


files = Dir.glob('./posts/*').reject{ |e| File.directory? e }

length = files.length

post = rand(length)

file = File.open(files[post])

object = []

file.each do |line| 
	object.push(line.split(" "))
end

puts object

file.close