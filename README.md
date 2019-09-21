Not much to see here yet. Just some notes

add the following to the header request:

Session.Request.Headers.Add("x-api-version", 2);



GET Establishments?name={name}&address={address}