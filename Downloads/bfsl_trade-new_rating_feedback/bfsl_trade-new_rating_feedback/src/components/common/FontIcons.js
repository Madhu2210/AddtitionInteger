import React from 'react';
import { SORT_TYPES } from '../../common/Constants';

export const UserIcon = (props) => {
    return (
        <span className="bfsl-font userIcon"
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            A
        </span>
    );
}

export const PasswordIcon = (props) => {
    return (
        <span className="bfsl-font passwordIcon"
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            C
        </span>
    );
}

export const PanNumberIcon = (props) => {
    return (
        <span className="bfsl-font panNumIcon"
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            F
        </span>
    );
}

export const PhoneIcon = (props) => {
    return (
        <span className="bfsl-font phoneIcon"
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            I
        </span>
    );
}

export const EmailIcon = (props) => {
    return (
        <span className="bfsl-font emailIcon"
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            J
        </span>
    );
}

export const InfoIcon = (props) => {
    return (
        <span className={`bfsl-font infoIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            B
        </span>
    );
}

export const CloseIcon = (props) => {
    return (
        <span className={`bfsl-font closeIcon cursor ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            f
        </span>
    );
}

export const AccBlockedIcon = (props) => {
    return (
        <span className={`bfsl-font accBlockedIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            K
        </span>
    );
}

export const PasswordExpiredIcon = (props) => {
    return (
        <span className={`bfsl-font passwordExpired ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            L
        </span>
    );
}

export const MinimizeIcon = (props) => {
    return (
        <span className={`bfsl-font minimizeIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            X
        </span>
    );
}

export const MaximizeIcon = (props) => {
    return (
        <span className={`bfsl-font maximizeIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            V
        </span>
    );
}

export const DownArrowIcon = (props) => {
    return (
        <span className={`bfsl-font downArrowIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
            title={props.title}
        >
            T
        </span>
    );
}

export const AddIcon = (props) => {
    return (
        <span className={`bfsl-font addIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            n
        </span>
    );
}

export const DeleteIcon = (props) => {
    return (
        <span className={`bfsl-font deleteIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
            title={props.title}
        >
            S
        </span>
    );
}

export const AlertIcon = (props) => {
    return (
        <span className={`bfsl-font alertIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            Y
        </span>
    );
}

export const NotifyIcon = (props) => {
    return (
        <span className={`bfsl-font alertIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            %
        </span>
    );
}

export const CreateAlertIcon = (props) => {
    return (
        <span className={`bfsl-font CreatealertIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            $
        </span>
    );
}

export const MessageIcon = (props) => {
    return (
        <span className={`bfsl-font messageIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            @
        </span>
    );
}

export const CalculatorIcon = (props) => {
    return (
        <span className={`bfsl-font calculatorIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            R
        </span>
    );
}

export const SettingsIcon = (props) => {
    return (
        <span className={`bfsl-font settingsIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            e
        </span>
    );
}

export const ReportIcon = (props) => {
    return (
        <span className={`bfsl-font reportIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            f
        </span>
    );
}

export const SearchIcon = (props) => {
    return (
        <span className={`bfsl-font searchIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
            title={props.title}
        >
            N
        </span>
    );
}

export const FilterIcon = (props) => {
    return (
        <span className={`bfsl-font filterIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
            title={props.title}
        >
            X
        </span>
    );
}

export const ChartIcon = (props) => {
    return (
        <span className={`bfsl-font chartIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            S
        </span>
    );
}

export const DownArrow = (props) => {
    return (
        <span className={`bfsl-font downArrow ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            a
        </span>
    );
}

export const UpArrow = (props) => {
    return (
        <span className={`bfsl-font upArrow ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            b
        </span>
    );
}

export const SortIcon = (props) => {
    const { colName, getSortIcon, type } = props;
    return (
        <span className="sort-icon-container">
            <span className={`bfsl-font arrow-up cursor 
                ${getSortIcon(colName) === null ? "non-sort" : getSortIcon(colName) ? "non-sort" : ""}`}
            onClick={props.onIconSort ? () => props.onIconSort(type, colName, SORT_TYPES.DESC) : ''}
            >
                b
            </span>
            <span className={`bfsl-font arrow-down cursor
                ${getSortIcon(colName) === null ? "non-sort" : getSortIcon(colName) ? "" : "non-sort"}`}
            onClick={props.onIconSort ? () => props.onIconSort(type, colName, SORT_TYPES.ASC) : ''}
            >
                c
            </span>
        </span>
    );
}

export const SuccessIcon = (props) => {
    return (
        <span className={`bfsl-font successIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            M
        </span>
    );
}

export const ErrorIcon = (props) => {
    return (
        <span className={`bfsl-font errorIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            k
        </span>
    );
}

export const DatePickerIcon = (props) => {
    return (
        <span className={`bfsl-font dateIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            h
        </span>
    );
}

export const RoundPlusIcon = (props) => {
    return (
        <span className={`bfsl-font plusIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            g
        </span>
    );
}

export const RoundMinusIcon = (props) => {
    return (
        <span className={`bfsl-font minusIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            T
        </span>
    );
}

export const UpArrowIcon = (props) => {
    return (
        <span className={`bfsl-font upArrowIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            g
        </span>
    );
}

export const CheckBoxIcon_Checked = (props) => {
    return (
        <span className={`bfsl-font checkboxIcon checked ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            Q
        </span>
    );
}

export const CheckBoxIcon_UnChecked = (props) => {
    return (
        <span className={`bfsl-font checkboxIcon unChecked ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            P
        </span>
    );
}

export const EyeOpenIcon = (props) => {
    return (
        <span className={`bfsl-font eyeOpenIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            D
        </span>
    );
}

export const EyeCloseIcon = (props) => {
    return (
        <span className={`bfsl-font eyeCloseIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            E
        </span>
    );
}

export const VirtualTradeIcon = (props) => {
    return (
        <span className={`bfsl-font virtualTradeIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            G
        </span>
    )
}

export const GuestUserIcon = (props) => {
    return (
        <span className={`bfsl-font guestUserIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            H
        </span>
    )
}

export const MenuIcon = (props) => {
    return (
        <span className={`bfsl-font menuIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            W
        </span>
    )
}

export const EditWatchlistIcon = (props) => {
    return (
        <span className={`bfsl-font edit-icon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            U
        </span>
    )
}

export const RearrangeIcon = (props) => {
    return (
        <span className={`bfsl-font reArrange-icon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            Z
        </span>
    )
}

export const AddSymIcon = (props) => {
    return (
        <span className={`bfsl-font addSym-icon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            O
        </span>
    )
}

export const TickIcon = (props) => {
    return (
        <span className={`bfsl-font tick-icon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            a
        </span>
    )
}

export const RightArrowIcon = (props) => {
    return (
        <span className={`bfsl-font rightArrowIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            e
        </span>
    )
}

export const LeftArrowIcon = (props) => {
    return (
        <span className={`bfsl-font leftArrowIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            d
        </span>
    )
}

export const CirclePlusIcon = (props) => {
    return (
        <span className={`bfsl-font plusIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            l
        </span>
    )
}

export const CircleMinusIcon = (props) => {
    return (
        <span className={`bfsl-font minusIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            m
        </span>
    )
}

export const ShowMoreIcon = (props) => {
    return (
        <span className={`bfsl-font showMore ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            i
        </span>
    )
}

export const ShowLessIcon = (props) => {
    return (
        <span className={`bfsl-font showLess ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            j
        </span>
    )
}

export const RefreshIcon = (props) => {
    return (
        <span className={`bfsl-font refreshIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            k
        </span>
    )
}

export const LogoutIcon = (props) => {
    return (
        <span className={`bfsl-font logoutIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            n
        </span>
    )
}

export const LeftArrowIcon2 = (props) => {
    return (
        <span className={`bfsl-font leftArrowIcon2 ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            o
        </span>
    )
}

export const RightArrowIcon2 = (props) => {
    return (
        <span className={`bfsl-font rightArrowIcon2 ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            p
        </span>
    )
}

export const PlusIcon = (props) => {
    return (
        <span className={`bfsl-font plusIcon ${props.className}`}
            title="Add Watchlist"
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            q
        </span>
    )
}

export const MoreInfoIcon = (props) => {
    return (
        <span className={`bfsl-font moreInfoIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            r
        </span>
    )
}
export const CameraIcon = (props) => {
    return (
        <span className="bfsl-font camera_ico"
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            s
        </span>
    );
}

export const GoldPackIcon = (props) => {
    return (
        <span className="bfsl-font goldpack_ico"
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            t
        </span>
    );
}

export const DarkThemeIcon = (props) => {
    return (
        <span className="bfsl-font darkThemeIcon"
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            7
        </span>
    );
}

export const LightThemeIcon = (props) => {
    return (
        <span className="bfsl-font lightThemeIcon"
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            8
        </span>
    );
}

export const ClockIcon = (props) => {
    return (
        <span className={`bfsl-font clockIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            0
        </span>
    )
}

export const IncomeDeclarationIcon = (props) => {
    return (
        <span className={`bfsl-font incomeDeclareIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            #
        </span>
    )
}

export const DownloadIcon = (props) => {
    return (
        <span className={`bfsl-font downloadIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            ^
        </span>
    )
}

export const HeadPhonesIcon = (props) => {
    return (
        <span className={`bfsl-font headPhoneIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            &
        </span>
    )
}

export const UpArrowTradeIcon = (props) => {
    return (
        <span className={`bfsl-font uparrowtradeicon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            (
        </span>
    )
}

export const DownArrowTradeIcon = (props) => {
    return (
        <span className={`bfsl-font downarrowtradeicon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            _
        </span>
    )
}

export const ValueIcon = (props) => {
    return (
        <span className={`bfsl-font-2 valueIcon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            C
        </span>
    )
}

export const PdfIcon = (props) => {
    return (
        <span className={`bfsl-font pdficon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            \
        </span>
    )
}

export const DigitalIcon = (props) => {
    return (
        <span className={`bfsl-font-2 digitalicon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            B
        </span>
    )
}

export const InterestIcon = (props) => {
    return (
        <span className={`bfsl-font-2 interesticon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            D
        </span>
    )
}

export const ChargesIcon = (props) => {
    return (
        <span className={`bfsl-font-2 chargesicon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            E
        </span>
    )
}

export const StocksIcon = (props) => {
    return (
        <span className={`bfsl-font-2 stocksicon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            F
        </span>
    )
}

export const IntamountIcon = (props) => {
    return (
        <span className={`bfsl-font-2 intamounticon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            G
        </span>
    )
}

export const Checkbox_nor = (props) => {
    return (
        <span className={`bfsl-font-2 checkboxnor ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            H
        </span>
    )
}

export const Checkbox_sel = (props) => {
    return (
        <span className={`bfsl-font-2 checkboxnor ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            I
        </span>
    )
}

export const CopyTextIcon = (props) => {
    return (
        <span className={`bfsl-font copytexticon ${props.className}`}
            onClick={props.onClick}
            title={props.title}
        >
            =
        </span>
    )
}
export const Withdraw_icon = (props) => {
    return (
        <span className={`bfsl-font-2 withdrawicon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            Y
        </span>
    )
}
export const Share_icon = (props) => {
    return (
        <span className={`bfsl-font-2 Shareicon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            W
        </span>
    )
}
export const Statement_icon = (props) => {
    return (
        <span className={`bfsl-font-2 Statementicon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
          X
        </span>
    )
}

export const Congo_icon = (props) => {
    return (
        <span className={`bfsl-font-2 congoicon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            J
        </span>
    )
}

export const CsvIcon = (props) => {
    return (
        <span className={`bfsl-font csvicon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            /
        </span>
    )
}

export const Sorry_icon = (props) => {
    return (
        <span className={`bfsl-font-2 sorryicon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            K
        </span>
    )
}

export const CalenderEditIcon = (props) => {
    return (
        <span className={`bfsl-font calendericon ${props.className}`}
            onClick={props.onClick}
            title={props.title}
        >
            {'}'}
        </span>
    )
}

export const Request_icon = (props) => {
    return (
        <span className={`bfsl-font-2 requesticon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            L
        </span>
    )
}

export const Confirm_icon = (props) => {
    return (
        <span className={`bfsl-font-2 confirmicon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            M
        </span>
    )
}

export const Right_icon = (props) => {
    return (
        <span className={`bfsl-font-2 righticon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            O
        </span>
    )
}

export const Pledge_icon = (props) => {
    return (
        <span className={`bfsl-font-2 pledgeicon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            P
        </span>
    )
}

export const Add_icon = (props) => {
    return (
        <span className={`bfsl-font-2 addicon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            Q
        </span>
    )
}

export const DemoTourIcon = (props) => {
    return (
        <span className={`bfsl-font demotouricon ${props.className}`}
            onClick={props.onClick}
            title={props.title}
        >
            |
        </span>
    )
}

export const Less_icon = (props) => {
    return (
        <span className={`bfsl-font-2 lessicon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            R
        </span>
    )
}
export const Refrsh_icon = (props) => {
    return (
        <span className={`bfsl-font-2 refrshicon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            S
        </span>
    )
}

export const Process_icon = (props) => {
    return (
        <span className={`bfsl-font-2 processicon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            T
        </span>
    )
}

export const Tracker_icon = (props) => {
    return (
        <span className={`bfsl-font-2 trackericon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            V
        </span>
    )
}
export const TickMark_icon = (props) => {
    return (
        <span className={`bfsl-font-2 tickmarkicon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            r
        </span>
    )
}
export const MoneyBack_icon = (props) => {
    return (
        <span className={`bfsl-font-2 moneybackicon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            n
        </span>
    )
}
export const RadioButton_icon = (props) => {
    return (
        <span className={`bfsl-font-2 radiobuttonicon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            p
        </span>
    )
}
export const Ledger_icon = (props) => {
    return (
        <span className={`bfsl-font-2 ledgerbuttonicon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            m
        </span>
    )
}
export const NetBanking_icon = (props) => {
    return (
        <span className={`bfsl-font-2 netBankingbuttonicon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            o
        </span>
    )
}
export const Star_icon = (props) => {
    return (
        <span className={`bfsl-font-2 staricon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            q
        </span>
    )
}
export const Timer_icon = (props) => {
    return (
        <span className={`bfsl-font-2 timericon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            j
        </span>
    )
}

export const Language_icon = (props) => {
    return (
        <span className={`bfsl-font-2 languageicon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            i
        </span>
    )
}

export const HoldingsQtyIcon = (props) => {
    return (
        <span className={`bfsl-font-2 holdingsqtyicon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            t
        </span>
    )
}

export const SortingShowIcon = (props) => {
    return (
        <span className={`bfsl-font-2 sortingshowicon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            s
        </span>
    )
}

export const AscSortingIcon = () => {
    
    return (
        <span className="watch-sort-icon">

            <span className="bfsl-font-2 ascsortingicon cursor"

            >
                u
            </span>
        </span>
    );
}
export const DscSortingIcon = () => {
   
    return (
        <span className="watch-sort-icon">
            <span className="bfsl-font-2 dscsortingicon cursor" 
            >
                v
            </span>
        </span>
    );
}
export const AscOrderSortIcon = (props) => {
    return (
        <span className={`bfsl-font-2 sortingshowicon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            u
        </span>
    )
}
export const DescOrderSortIcon = (props) => {
    return (
        <span className={`bfsl-font-2 sortingshowicon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            v
        </span>
    )
}
export const KeyboardIcon = (props) => {
    return (
        <span className={`bfsl-font-2 sortingshowicon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            y
        </span>
    )
}
export const PasswordLockIcon = (props) => {
    return (
        <span className={`bfsl-font-2 sortingshowicon ${props.className}`}
            onClick={props.onClick}
            tabIndex={props.tabIndex}
        >
            x
        </span>
    )
}
