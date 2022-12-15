## Example of what post object will look like

post === {
'e38476': {
id: 'e38476',
title: 'some Post title',
comments: [
{id : 'k1235', content: 'A comment to the postId'}
]
}
}, etc for every post

As we recieve data we will insert this to the post object in the correct structure.

When we are finished update Reach app.

Right now, React app is pulling from both Posts Service and Comments Service, we will change that so React will pull from Query Service and get Posts/Comments data.

Posts/Comments Services are still responsible for creating, so React will still need to reach out to them to create. THIS IS JUST READ DATA.
