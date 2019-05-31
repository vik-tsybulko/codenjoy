package com.codenjoy.dojo.a2048.model;

/*-
 * #%L
 * Codenjoy - it's a dojo-like platform from developers to developers.
 * %%
 * Copyright (C) 2018 Codenjoy
 * %%
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 * #L%
 */


import com.codenjoy.dojo.services.Direction;
import com.codenjoy.dojo.services.multiplayer.PlayerHero;

public class Hero extends PlayerHero<Field> {

    private Direction direction;
    private boolean clear;

    public Hero() {
        super(0, 0);
        clear = false;
        clearDirection();
    }

    public Direction getDirection() {
        return direction;
    }

    @Override
    public void down() {
        direction = Direction.DOWN;
    }

    @Override
    public void up() {
        direction = Direction.UP;
    }

    @Override
    public void left() {
        direction = Direction.LEFT;
    }

    @Override
    public void right() {
        direction = Direction.RIGHT;
    }

    @Override
    public void act(int... p) {
        clear();
    }

    @Override
    public void tick() {
        // do nothing
    }

    public void clearDirection() {
        direction = null;
    }

    public boolean isClear() {
        return clear;
    }

    public boolean isAlive() {
        return !field.isGameOver();
    }

    public void clear() {
        clear = true;
    }
}
