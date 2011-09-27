require "sinatra"
require "json"

$db = []
$id = 0

mime_type :json, "application/json"

get "/" do
  content_type :html
  File.read("public/index.html")
end

get "/todo-items" do
  content_type :json
  $db.to_json
end

post "/todo-items" do
  item = {
    "id" => $id,
    "text" => params[:item],
    "done" => false
  }

  $db << item
  $id += 1

  content_type :json
  item.to_json
end

post "/todo-items/:id" do
  $db[params[:id].to_i]["done"] = params[:done] == "true"
  content_type :json
  $db[params[:id].to_i].to_json
end
