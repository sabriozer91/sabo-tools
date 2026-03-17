require 'webrick'
require 'fileutils'

src = '/Users/sabriozer/Desktop/webp resizer'
dest = '/tmp/webp-resizer-serve'

FileUtils.rm_rf(dest)
FileUtils.mkdir_p(dest)
Dir.glob(File.join(src, '**', '*')).each do |f|
  next unless File.file?(f)
  next if f.include?('.claude')
  next if f.include?('server.rb')
  rel = f.sub(src + '/', '')
  target = File.join(dest, rel)
  FileUtils.mkdir_p(File.dirname(target))
  FileUtils.cp(f, target)
end

port = (ENV['PORT'] || 8080).to_i
server = WEBrick::HTTPServer.new(Port: port, DocumentRoot: dest)
trap('INT') { server.shutdown }
trap('TERM') { server.shutdown }
server.start
