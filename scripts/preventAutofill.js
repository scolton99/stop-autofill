const main = async () => {
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', main);
    return;
  }

  const { matchPatterns: matches } = await chrome.storage.sync.get({ matchPatterns: {} });
  console.debug(JSON.stringify(matches, null, 2));

  for (const [regex, selectors] of Object.entries(matches)) {
    try {
      const pattern = new RegExp(regex);
      if (!window.location.href.match(pattern))
        continue;

      console.log(`Current page '${window.location.href}' matched regex '${regex}'`);

      const mutationHandler = list => {
        const hasMutation = !!list.find(it => it.type === 'childList');
        if (!hasMutation)
          return;
    
        const elements = Array.from(document.querySelectorAll(selectors.join(',')));
        let count = 0;
    
        for (const el of elements) {
          if (el instanceof HTMLInputElement && el.type === 'password') {
            if (el.getAttribute('autocomplete') !== 'new-password') {
              el.setAttribute('autocomplete', 'new-password');
              ++count;
            }
          }
        }
        
        console.log(`Updated ${count} elements`);
      };

      // Have to do all this via MutationObserver since the page might not be
      // fully loaded (e.g., AJAX) when this script runs the first time
      const observer = new MutationObserver(mutationHandler);
    
      observer.observe(document, {
        subtree: true,
        childList: true
      });
    } catch (e) {
      console.error(`Invalid RegEx: ${regex}`);
    }
  }
};

main();

// Do this for sites like the SSO console that use AJAX to navigate to new pages without a full
// page reload
window.addEventListener('hashchange', main);