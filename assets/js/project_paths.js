const appendForwardSlash = (path) => path.endsWith('/') ? path : path + '/';

function getRelativeRoot() {
    let protocol = window.location.protocol; // e.g. "http:" or "https:"
    let host = window.location.host; // e.g., "www.example.com" or "localhost:8080"
    let siteRoot = appendForwardSlash(protocol + "//" + host);  // e.g. http://www.example.com/
    return siteRoot
}

export {
    getRelativeRoot
};
