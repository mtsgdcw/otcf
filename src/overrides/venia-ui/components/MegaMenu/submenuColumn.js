import React from 'react';
import { Link } from 'react-router-dom';

import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './submenuColumn.module.css';
import PropTypes, { shape, string } from 'prop-types';

/**
 * The SubmenuColumn component displays columns with categories in submenu
 *
 * @param {MegaMenuCategory} props.category
 * @param {function} props.onNavigate - function called when clicking on Link
 */
const SubmenuColumn = props => {
    const {
        category,
        categoryUrlSuffix,
        onNavigate,
        handleCloseSubMenu
    } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const categoryUrl = resourceUrl(
        `/${category.url_path}${categoryUrlSuffix || ''}`
    );

    const renderCategoryLink = (category, index, isLast) => {
        const { url_path, isActive, name } = category;
        const categoryUrl = resourceUrl(
            `/${url_path}${categoryUrlSuffix || ''}`
        );
        const keyboardProps = isLast ? props.keyboardProps : {};

        return (
            <Link
                {...keyboardProps}
                key={index}
                className={isActive ? classes.linkActive : classes.link}
                data-cy="MegaMenu-SubmenuColumn-link"
                to={categoryUrl}
                onClick={onNavigate}
            >
                {name}
            </Link>
        );
    };

    const renderSubCategoryChildren = subCategoryChildren =>
        subCategoryChildren.map((category, index, arr) => (
            <li key={index} className={classes.submenuChildItem}>
                {renderCategoryLink(category, index, index === arr.length - 1)}
            </li>
        ));

    const children = category?.children?.length ? (
        <ul>
            {category.children.map((subCategory, index, arr) => (
                <li key={index} className={classes.submenuChildItem}>
                    {renderCategoryLink(
                        subCategory,
                        index,
                        index === arr.length - 1
                    )}
                    {subCategory.children?.length > 0 && (
                        <ul>
                            {renderSubCategoryChildren(subCategory.children)}
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    ) : null;

    // setting keyboardProps if category does not have any sub-category
    const keyboardProps = category.children.length ? {} : props.keyboardProps;

    return (
        <div className={classes.submenuColumn}>
            <Link
                {...keyboardProps}
                className={classes.link}
                data-cy="MegaMenu-SubmenuColumn-link"
                to={categoryUrl}
                onClick={() => {
                    handleCloseSubMenu();
                    onNavigate();
                }}
            >
                <span className={classes.heading}>{category.name}</span>
            </Link>
            {children}
        </div>
    );
};

export default SubmenuColumn;

SubmenuColumn.propTypes = {
    classes: shape({
        submenuColumn: string,
        submenuChildItem: string,
        link: string,
        linkActive: string,
        heading: string
    }),
    category: PropTypes.shape({
        children: PropTypes.array,
        uid: PropTypes.string.isRequired,
        include_in_menu: PropTypes.number,
        isActive: PropTypes.bool.isRequired,
        name: PropTypes.string.isRequired,
        path: PropTypes.array.isRequired,
        position: PropTypes.number.isRequired,
        url_path: PropTypes.string.isRequired
    }).isRequired,
    categoryUrlSuffix: PropTypes.string,
    onNavigate: PropTypes.func.isRequired,
    handleCloseSubMenu: PropTypes.func.isRequired
};
