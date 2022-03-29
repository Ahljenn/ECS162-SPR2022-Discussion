let profiles = document.getElementsByClassName('profile');

// We need to use 'of' instead of 'in' here to iterate through the _values_ instead of the _keys_ of the selection
for (let profile of profiles) {
    let bio = profile.getElementsByClassName('bio')[0];
    let portrait = profile.getElementsByClassName('portrait')[0];

    profile.onmouseover = () => {
        portrait.classList.add('backdrop');
        bio.style.display = 'block';
    }
    profile.onmouseout = () => {
        portrait.classList.remove('backdrop');
        bio.style.display = 'none';
    }
}
