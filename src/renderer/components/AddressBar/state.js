import { useCallback, useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';

import { first } from 'root/common';
import TabBarState from '../TabBar/state';

const useAddressBarState = () => {
  const { tabs, setTabs } = TabBarState.useContainer();

  const activeTab = first(tabs.filter(({ active }) => !!active));

  const [isSearchBarFocused, setIsSearchBarFocused] = useState(false);
  const handleSearchBarFocusChange = useCallback(
    (isFocus) => () => {
      setIsSearchBarFocused(isFocus);
    },
    [],
  );

  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(activeTab?.url || '');
  }, [activeTab?.url]);

  const handleInputValueChange = useCallback(
    (e) => {
      setTabs((his) =>
        [...his].map((tab) => {
          if (tab.id === activeTab?.id) {
            tab.url = e.target.value;
          }
          return tab;
        }),
      );

      // setUrl(e.target.value);
    },
    [activeTab],
  );

  return {
    activeTab,
    isSearchBarFocused,
    handleSearchBarFocusChange,
    url,
    handleInputValueChange,
    get urlSegments() {
      try {
        return new URL(url);
      } catch (error) {
        return url;
      }
    },
  };
};
const AddressBarState = createContainer(useAddressBarState);

export default AddressBarState;
