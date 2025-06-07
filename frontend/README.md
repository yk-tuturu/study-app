Guide to the random bullshit I wrote: 

The few main pages that are mostly done is index.tsx, timer.tsx, and login/register
I already made a test login account under tuturu@gmail.com, password: 12345678

features added: 
- login/signup
- the timer system (but for now the timer just continues running when you put the app in the background)
- the timer can be paused or terminated early 
- you can add subjects and select the corresponding subject to study for 

components: 
I made a bunch of (hopefully reusable) UI components
Notable components: 
<ThemedText> -- use this for any text in the app. Takes in "type" as a prop, which goes from "font_xs", "font_sm", "font_md" etc etc, until "font_xxl". can also take in "style" if you need to modify more stuff. also feel free to add any new categories in the themedtext component itself if you need 

There are several button types: 
- <IconButton> for square buttons with a single image inside. Inside the tags put your designated <Image> component 
- <TextButton> for... text buttons. Put a <ThemedText> component inside
- <CircularButton> for... circular buttons. no one was surprised 

<TextOutline> dumb hack to make texts have outlines. apparently they dont do that by default

<StyledTextInput> for any text input. I made it so that it can potentially change color when user clicks on it, but you can set the "changeColor" prop to false if you dont want that 
<Dropdown> for the menu. lowkey copied the code online, not sure what im doing there 
<ThemedModal> for if you want to use modals. Wrap the contents of your modal in a <View> and put it inside (right now there's a weird bug where the animation for the modal kind of flashes, i think its a problem with the library i used, need to look into how to fix that)
<Toggle> for toggles 

The /template folder under components is a bunch of components that came with the app template, which I'm not using but I stashed them there just in case 

Theres also some more custom components for things like the cat, the timer display and the background. 

Contexts: 
- There's two contexts objects, authContext and timerContext 
authContext is straightforward, it holds a bunch of functions for login, logout, register, and even holds the user token. Call useAuth() if you need to use them 

timerContext is lowkey a clusterfuck but it's responsible for all the timer logic: 
Variables: 
- isRunning checks if the timer is running, this should always be true whenever you want your timer display to be shown
- isEnded this becomes true when the timer ends and you want to show the modal that displays the users stats. Dismissing that modal sets both isRunning and isEnded to false
- endStats: just holds your endStats for the timer end modal
- remaining: your remaining time 

Functions:
- startTimer() starts the timer 
- updateRemaining() is not available publicly, but it handles the counting down of the timer. it's actually an animation and at every frame of the animation, it tracks how much time has passed since the last frame and add that to the elapsedRef (im using refs a lot here because state gets really buggy when i try to use it to track time)
- getDuration() just gets the set duration of the timer. not sure if this is actually used
- pauseTimer() pauses
- unpauseTimer() unpauses
- getPaused() checks your pause state
- getElapsedInMins() what it says
- submitTime() not publicly available, but the updateRemaining() function calls this automatically at the end of the timer to submit data to the backend. When this is successfully done it sets isEnded to true to show the end modal
- endTimer() prematurely ends the timer, and calls submitTimer
- getCurrentSubject() what it says
- clearTimer() wipes all the data once the timer is fully gone and dismissed 

