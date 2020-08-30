# Quarantet

You can try it out [here](http://quarantet.me)!

Quarantet is a web app made for musicians to collaborate. Inspired by the 2020 coronavirus pandemic since all large gatherings (aka orchestra and chamber rehearsals) were cancelled.

Since then, videos have popped up of musicians trying to make the best of the situation by performing in isolation and layering audio with others afterwards. However, this requires a click track, sophisticated audio mixing software, and having each member sending over large files.

My solution was to put all of that into one interface. Custom rooms can be generated, with a click track set by the first member so that the tempo is consistent throughout. Other members can simply use the link or enter the group's name on the homepage to access the group's recordings. Lastly, all recordings are stored on the cloud and can be played simultaneously to get the final result!

With this project, I learned about 
1. Express.js, using it to create the routes for all the customizable rooms
2. Google Firebase, using Storage for the audio files and the Database for the tempo/beat information. Next to do: incorporating the Firebase Analytics for my project.
3. how audio is used in a web context, both in terms of creating and recording audio


