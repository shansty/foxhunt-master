import { Paper } from '@mui/material';
import clsx from 'clsx';

interface FooterProps {
  footerFixed?: boolean;
  portalName?: string;
}

export function Footer({ footerFixed, portalName }: FooterProps) {
  return (
    <Paper
      square
      className={clsx('app-footer text-black-50', {
        'app-footer--fixed': footerFixed,
      })}
    >
      <div className="app-footer--inner">
        <div className="app-footer--first"></div>
        <div className="app-footer--second">
          <span>{portalName}</span> © 2022 by
          <a
            href="https://www.itechart.com/"
            rel="noopener noreferrer"
            style={{ paddingLeft: `${3}px` }}
            target="_blank"
            title="iTechArt.com"
          >
            iTechArt Group
          </a>
        </div>
      </div>
    </Paper>
  );
}
