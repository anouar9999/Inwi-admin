import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const NavItem = ({ item, level, pathDirect, hideMenu, onClick }) => {
  const customizer = useSelector((state) => state.customizer);
  const Icon = item?.icon;
  const { t } = useTranslation();

  const isSelected = pathDirect === item?.href;
  const isSubItem = level > 1;

  const itemIcon = isSubItem ? (
    <Icon className="w-4 h-4" />
  ) : (
    <Icon className="w-5 h-5" />
  );

  const baseClasses = `
    flex items-center w-full px-4 py-2 mb-1 text-sm transition-colors duration-150 ease-in-out
    rounded-md ${customizer.borderRadius ? `rounded-${customizer.borderRadius}` : ''}
  `;

  const colorClasses = isSelected
    ? 'text-white bg-blue-600 hover:bg-blue-700'
    : `text-gray-600 hover:bg-blue-50 hover:text-blue-600
      ${isSubItem && isSelected ? 'text-blue-600' : ''}`;

  const paddingLeftClass = hideMenu
    ? 'pl-4'
    : level > 2
    ? `pl-${level * 4}`
    : 'pl-4';

  return (
    <li>
      <Link 
        href={item.href} 
        passHref
        className={`${baseClasses} ${colorClasses} ${paddingLeftClass}`}
        onClick={onClick}
      >
        <span className="inline-flex items-center justify-center w-8">
          {itemIcon}
        </span>
        {!hideMenu && (
          <span className="ml-3">
            {t(`${item?.title}`)}
            {item?.subtitle && (
              <span className="block text-xs text-gray-500">
                {item?.subtitle}
              </span>
            )}
          </span>
        )}
        {item?.chip && !hideMenu && (
          <span className={`
            ml-auto px-2 py-1 text-xs font-medium rounded-full
            ${item?.chipColor === 'primary' ? 'bg-blue-100 text-blue-800' : 
              item?.chipColor === 'secondary' ? 'bg-purple-100 text-purple-800' : 
              'bg-gray-100 text-gray-800'}
          `}>
            {item?.chip}
          </span>
        )}
      </Link>
    </li>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
  pathDirect: PropTypes.any,
  hideMenu: PropTypes.any,
  onClick: PropTypes.func,
};

export default NavItem;